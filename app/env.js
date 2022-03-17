const envalid = require('envalid')
const dotenv = require('dotenv')
const { version } = require('../package.json')

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: 'test/test.env' })
} else {
  dotenv.config({ path: '.env' })
}

const vars = envalid.cleanEnv(
  process.env,
  {
    SERVICE_TYPE: envalid.str({ default: 'veritable-acapy-proxy'.toUpperCase().replace(/-/g, '_') }),
    PORT: envalid.port({ default: 80, devDefault: 3000 }),
    SERVICE_HOST: envalid.host({ devDefault: 'localhost' }),
    SERVICE_PORT: envalid.port({ default: 80, devDefault: 3000 }),
    API_VERSION: envalid.str({ default: version }),
    API_MAJOR_VERSION: envalid.str({ default: 'v1' }),
    LOG_LEVEL: envalid.str({ default: 'info', devDefault: 'debug' }),
    ACAPY_API_KEY: envalid.str({ devDefault: 'API_KEY' }),
    ACAPY_ADMIN_SERVICE: envalid.str({ devDefault: 'http://localhost:8012' }),
    AUTH_AUDIENCE: envalid.str({ devDefault: 'http://veritable-dev' }),
    AUTH_ISSUER: envalid.url({ devDefault: 'https://veritable.eu.auth0.com/' }),
  },
  {
    strict: true,
  }
)

module.exports = vars
