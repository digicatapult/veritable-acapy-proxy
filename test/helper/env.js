const envalid = require('envalid')
const dotenv = require('dotenv')
const appEnv = require('../../app/env')

dotenv.config({ path: '.env' })
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: 'test/test.env' })
}

const vars = envalid.cleanEnv(
  process.env,
  {
    AUTH_CLIENT_ID: envalid.str(),
    AUTH_SECRET: envalid.str(),
    AUTH_TOKEN_ENDPOINT: envalid.str(),
  },
  {
    strict: true,
  }
)

module.exports = {
  ...appEnv,
  ...vars,
}
