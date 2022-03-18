const { before } = require('mocha')
const { AUTH_CLIENT_ID, AUTH_SECRET, AUTH_TOKEN_ENDPOINT, AUTH_AUDIENCE } = require('./env')

let token, subWalletName
const withAuthToken = (context) => {
  before(async function () {
    if (token) {
      Object.assign(context, { token, subWalletName })
      return
    }

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

    const tokenResult = await tokenFetch.json()

    token = tokenResult.access_token
    context.token = tokenResult.access_token
    subWalletName = `${AUTH_CLIENT_ID}@clients`
    context.subWalletName = `${AUTH_CLIENT_ID}@clients`
  })
}

module.exports = { withAuthToken }
