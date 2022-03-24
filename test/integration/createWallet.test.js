const { describe, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { withAuthToken } = require('../helper/auth0')
const { withNoExistingWallet, withExistingWallet, finallyCleanUpWallet } = require('../helper/acapy')
const { createWallet, createWalletUnauthorized } = require('../helper/routeHelper')

describe('wallet creation', function () {
  describe('unauthenticated', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withNoExistingWallet(context)

    it('should fail with 401 Unauthorized', async function () {
      const response = await createWalletUnauthorized(context, {
        label: 'test',
        wallet_key: 'MySecretKey123',
        wallet_type: 'in_memory',
      })
      expect(response.status).to.equal(401)
      expect(response.text).to.be.a('String')
    })
  })

  describe('as a new user', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withNoExistingWallet(context)

    it('should create a new wallet', async function () {
      const response = await createWallet(context, {
        label: 'test',
        wallet_key: 'MySecretKey123',
        wallet_type: 'in_memory',
      })
      expect(response.status).to.equal(200)
      expect(response.body.wallet_id).to.be.a('String')
      expect(response.body.settings.default_label).to.equal('test')
    })

    finallyCleanUpWallet(context)
  })

  describe('as a new user with invalid body', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withNoExistingWallet(context)

    it('should pass through error', async function () {
      const response = await createWallet(context, {
        label: 'test',
        wallet_key: 'MySecretKey123',
        wallet_type: 'invalid_wallet_type',
      })
      expect(response.status).to.equal(422)
      expect(response.body).to.haveOwnProperty('wallet_type')
    })

    finallyCleanUpWallet(context)
  })

  describe('as an existing user', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)

    it('should not create a new wallet', async function () {
      const response = await createWallet(context, {
        label: 'test',
        wallet_key: 'MySecretKey123',
        wallet_type: 'in_memory',
      })
      expect(response.status).to.equal(409)
      expect(response.text).to.be.a('String')
    })

    finallyCleanUpWallet(context)
  })
})
