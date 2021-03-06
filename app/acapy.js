const { ACAPY_API_KEY, ACAPY_ADMIN_SERVICE } = require('./env')

const querySubWallets = async (subwalletName) => {
  const fetch = (await import('node-fetch')).default

  const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallets`)
  const search = new URLSearchParams({ wallet_name: subwalletName })
  url.search = search.toString()

  const queryResponse = await fetch(url, {
    headers: {
      'x-api-key': ACAPY_API_KEY,
    },
  })

  const wallets = await queryResponse.json()

  return wallets.results
}

const createSubWallet = async (body) => {
  const fetch = (await import('node-fetch')).default

  const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallet`)
  const createResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': ACAPY_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return createResponse
}

const getSubWalletToken = async (subWalletName) => {
  const fetch = (await import('node-fetch')).default

  const wallets = await querySubWallets(subWalletName)
  if (wallets.length !== 1) {
    return null
  }

  const wallet = wallets[0]
  const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallet/${wallet.wallet_id}/token`)
  const subWalletToken = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': ACAPY_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  const token = (await subWalletToken.json()).token
  return token
}

const serverStatusCall = async ({ query }) => {
  const fetch = (await import('node-fetch')).default

  const url = new URL(`${ACAPY_ADMIN_SERVICE}/status`)
  const search = new URLSearchParams(query)
  url.search = search.toString()

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': ACAPY_API_KEY,
    },
  })

  return response
}

const noBodyMethods = new Set(['GET', 'HEAD'])
const subWalletCall = async (token, { path, query, method, body }) => {
  const fetch = (await import('node-fetch')).default

  const url = new URL(`${ACAPY_ADMIN_SERVICE}${path}`)
  const search = new URLSearchParams(query)
  url.search = search.toString()

  const response = await fetch(url, {
    method,
    headers: {
      'x-api-key': ACAPY_API_KEY,
      authorization: `Bearer ${token}`,
      'content-type': noBodyMethods.has(method) ? undefined : 'application/json',
    },
    body: noBodyMethods.has(method) ? undefined : JSON.stringify(body),
  })

  return response
}

module.exports = {
  querySubWallets,
  createSubWallet,
  getSubWalletToken,
  serverStatusCall,
  subWalletCall,
}
