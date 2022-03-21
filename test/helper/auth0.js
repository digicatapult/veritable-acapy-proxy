const { before, after } = require('mocha')
const createJWKSMock = require('mock-jwks').default

const { AUTH_ISSUER, AUTH_AUDIENCE } = require('../../app/env')

const withAuthToken = (context) => {
  before(async function () {
    context.jwksMock = createJWKSMock(AUTH_ISSUER)
    context.jwksMock.start()
    const token = context.jwksMock.token({
      aud: AUTH_AUDIENCE,
      iss: AUTH_ISSUER,
      sub: 'test_client',
    })

    context.token = token
    context.subWalletName = 'test_client'
  })

  after(async function () {
    await context.jwksMock.stop()
  })
}

module.exports = { withAuthToken }
