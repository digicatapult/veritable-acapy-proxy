const express = require('express')
const cors = require('cors')
const pinoHttp = require('pino-http')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser')
const compression = require('compression')
const swagger2openapi = require('swagger2openapi')


const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const env = require('./env')
const logger = require('./logger')
const transformApiDoc = require('./util/transformApiDoc')
const { querySubWallets, createSubWallet, getSubWalletToken, serverStatusCall, subWalletCall } = require('./acapy')

const {
  SERVICE_HOST,
  SERVICE_PORT,
  SERVICE_TYPE,
  PORT,
  API_VERSION,
  API_MAJOR_VERSION,
  ACAPY_ADMIN_SERVICE,
  AUTH_ISSUER,
  AUTH_AUDIENCE,
} = env

async function createHttpServer() {
  const app = express()
  const requestLogger = pinoHttp({ logger })

  app.use(cors())
  app.use(compression())
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    if (req.path !== '/health') requestLogger(req, res)
    next()
  })

  app.get('/health', async (req, res) => {
    res.status(200).send({ version: API_VERSION, status: 'ok' })
    return
  })

  const acapyPathPrefix = `/${API_MAJOR_VERSION}/aca-py`
  const specTransformOptions = {
    title: SERVICE_TYPE,
    version: API_VERSION,
    pathPrefix: acapyPathPrefix,
  }
  app.get(`/${API_MAJOR_VERSION}/api-docs`, async (req, res) => {
    const apiDocResponse = await swagger2openapi.convertUrl(`${ACAPY_ADMIN_SERVICE}/api/docs/swagger.json`, {
      patch: true,
    })
    const apiDoc = apiDocResponse.openapi
    // TODO: cache this
    res.send(await transformApiDoc(apiDoc, specTransformOptions))
  })

  const options = {
    swaggerOptions: {
      urls: [
        {
          url: `http://${SERVICE_HOST}:${SERVICE_PORT}/${API_MAJOR_VERSION}/api-docs`,
          name: SERVICE_TYPE,
        },
      ],
    },
  }

  app.use(`/${API_MAJOR_VERSION}/swagger`, swaggerUi.serve, swaggerUi.setup(null, options))

  // auth0 middleware for authenticated routes
  app.use(
    acapyPathPrefix,
    jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        jwksUri: `${AUTH_ISSUER}/.well-known/jwks.json`,
      }),
      audience: AUTH_AUDIENCE,
      algorithms: ['RS256'],
    })
  )

  // wallet create
  app.post(`${acapyPathPrefix}/multitenancy/wallet`, async (req, res) => {
    const subject = req.user.sub
    const wallets = await querySubWallets(subject)
    if (wallets.length !== 0) {
      res.status(409).type('text/plain').send(`409 Wallet already exists`)
      return
    }

    const response = await createSubWallet({
      ...req.body,
      wallet_name: subject,
    })

    const result = Buffer.from(await response.arrayBuffer())
    res.status(response.status).type(response.headers.get('content-type')).send(result)
  })

  // get server status
  app.get(`${acapyPathPrefix}/status`, async (req, res) => {
    const response = await serverStatusCall({
      query: req.query,
    })
    const result = Buffer.from(await response.arrayBuffer())
    res.status(response.status).type(response.headers.get('content-type')).send(result)
  })

  // other paths
  app.all(`${acapyPathPrefix}/*`, async (req, res) => {
    const subject = req.user.sub
    const token = await getSubWalletToken(subject)

    if (token === null) {
      res.status(401).type('text/plain').send('401 Unauthorized')
      return
    }

    const response = await subWalletCall(token, {
      path: req.path.substring(acapyPathPrefix.length),
      query: req.query,
      method: req.method,
      body: req.body,
    })

    const result = Buffer.from(await response.arrayBuffer())
    res.status(response.status).type(response.headers.get('content-type')).send(result)
  })

  // Sorry - app.use checks arity. This is a defensive fallthrough to make sure we always
  // respond hence ignored in coverage
  /* istanbul ignore next */
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.status) {
      res
        .status(err.status)
        .type('text/plain')
        .send({ error: err.status === 401 ? 'Unauthorised' : err.message })
    } else {
      logger.error('Fallback Error %j', err.stack)
      res.status(500).type('text/plain').send('Fatal error!')
    }
  })

  return { app }
}

/* istanbul ignore next */
async function startServer() {
  try {
    const { app } = await createHttpServer()

    const setupGracefulExit = ({ sigName, server, exitCode }) => {
      process.on(sigName, async () => {
        server.close(() => {
          process.exit(exitCode)
        })
      })
    }

    const server = await new Promise((resolve, reject) => {
      let resolved = false
      const server = app.listen(PORT, (err) => {
        if (err) {
          if (!resolved) {
            resolved = true
            reject(err)
          }
        }
        logger.info(`Listening on port ${PORT} `)
        if (!resolved) {
          resolved = true
          resolve(server)
        }
      })
      server.on('error', (err) => {
        if (!resolved) {
          resolved = true
          reject(err)
        }
      })
    })

    setupGracefulExit({ sigName: 'SIGINT', server, exitCode: 0 })
    setupGracefulExit({ sigName: 'SIGTERM', server, exitCode: 143 })
  } catch (err) {
    logger.fatal('Fatal error during initialisation: %j', err)
    process.exit(1)
  }
}

module.exports = { startServer, createHttpServer }
