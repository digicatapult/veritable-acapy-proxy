const pino = require('pino')
const env = require('./env')

const logger = pino(
  {
    name: env.SERVICE_TYPE,
    level: env.LOG_LEVEL,
  },
  process.stdout
)

logger.debug('Environment variables: %j', { ...env })

module.exports = logger
