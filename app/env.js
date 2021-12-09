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
    SERVICE_TYPE: envalid.str({ default: 'vitalam-service-template'.toUpperCase().replace(/-/g, '_') }),
    PORT: envalid.port({ default: 80, devDefault: 3000 }),
    API_HOST: envalid.host({ devDefault: 'localhost' }),
    API_PORT: envalid.port({ default: 9944 }),
    API_VERSION: envalid.str({ default: version }),
    API_MAJOR_VERSION: envalid.str({ default: 'v1' }),
    LOG_LEVEL: envalid.str({ default: 'info', devDefault: 'debug' }),
    USER_URI: envalid.str({ devDefault: '//Alice' }),
    AUTH_JWKS_URI: envalid.url(),
    AUTH_AUDIENCE: envalid.str(),
    AUTH_ISSUER: envalid.url(),
    AUTH_TOKEN_URL: envalid.url(),
    METADATA_KEY_LENGTH: envalid.num({ default: 32 }),
    METADATA_VALUE_LITERAL_LENGTH: envalid.num({ default: 32 }),
  },
  {
    strict: true,
  }
)

module.exports = vars
