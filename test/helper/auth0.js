const { before } = require('mocha')
const { AUTH_CLIENT_ID, AUTH_SECRET, AUTH_TOKEN_ENDPOINT, AUTH_AUDIENCE } = require('./env')

const withAuthToken = (context) => {
  before(async function () {
    const fetch = (await import('node-fetch')).default

    const tokenFetch = await fetch(AUTH_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: AUTH_CLIENT_ID,
        client_secret: AUTH_SECRET,
        audience: AUTH_AUDIENCE,
        grant_type: 'client_credentials',
      }),
    })

    const token = await tokenFetch.json()

    context.token = token.access_token
    context.subWalletName = `${AUTH_CLIENT_ID}@clients`
  })
}

module.exports = { withAuthToken }
