const { before, after } = require('mocha')
const { ACAPY_API_KEY, ACAPY_ADMIN_SERVICE } = require('./env')

const cleanup = async (context) => {
  const fetch = (await import('node-fetch')).default

  const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallets`)
  const search = new URLSearchParams({ wallet_name: context.subWalletName })
  url.search = search.toString()
  const walletListFetch = await fetch(url, { headers: { 'x-api-key': ACAPY_API_KEY } })
  const walletList = (await walletListFetch.json()).results

  if (walletList.length > 0) {
    const walletId = walletList[0].wallet_id
    const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallet/${walletId}/remove`)
    await fetch(url, {
      method: 'POST',
      headers: { 'x-api-key': ACAPY_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
  }
}

const withNoExistingWallet = (context) => {
  before(async function () {
    await cleanup(context)
  })
}

const withExistingWallet = (context) => {
  before(async function () {
    const fetch = (await import('node-fetch')).default

    await cleanup(context)
    const url = new URL(`${ACAPY_ADMIN_SERVICE}/multitenancy/wallet`)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'x-api-key': ACAPY_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        label: 'test',
        wallet_key: 'MySecretKey123', // TODO: remove
        wallet_name: context.subWalletName, // TODO: remove
        wallet_type: 'in_memory',
      }),
    })
    context.walletId = (await response.json()).wallet_id
  })
}

const finallyCleanUpWallet = (context) => {
  after(async function () {
    await cleanup(context)
  })
}

module.exports = { withNoExistingWallet, withExistingWallet, finallyCleanUpWallet }
