const { describe, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { withAuthToken } = require('../helper/auth0')
const { withExistingWallet, withExistingDid, finallyCleanUpWallet } = require('../helper/acapy')
const { listDids, createDid } = require('../helper/routeHelper')

describe('sub-wallet methods', function () {
  describe('listing all dids', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)
    withExistingDid(context)

    it('should list 1 did', async function () {
      const response = await listDids(context)
      expect(response.status).to.equal(200)
      expect(response.body.results).to.be.a('Array')

      const results = response.body.results
      expect(results.length).to.equal(1)
      expect(results[0].did).to.equal(context.existingDid)
    })

    finallyCleanUpWallet(context)
  })

  describe('listing all dids without a wallet', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)

    it('should error 401', async function () {
      const response = await listDids(context)
      expect(response.status).to.equal(401)
    })

    finallyCleanUpWallet(context)
  })

  describe('listing dids with matching method', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)
    withExistingDid(context)

    it('should list 1 did', async function () {
      const response = await listDids(context, { method: 'sov' })
      expect(response.status).to.equal(200)
      expect(response.body.results).to.be.a('Array')

      const results = response.body.results
      expect(results.length).to.equal(1)
      expect(results[0].did).to.equal(context.existingDid)
    })

    finallyCleanUpWallet(context)
  })

  describe('listing dids with non-matching method', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)
    withExistingDid(context)

    it('should list 0 dids', async function () {
      const response = await listDids(context, { method: 'key' })
      expect(response.status).to.equal(200)
      expect(response.body.results).to.be.a('Array')

      const results = response.body.results
      expect(results.length).to.equal(0)
    })

    finallyCleanUpWallet(context)
  })

  describe('listing dids with invalid query', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)
    withExistingDid(context)

    it('should error 422', async function () {
      const response = await listDids(context, { method: 'invalid' })
      expect(response.status).to.equal(422)
      expect(response.body).to.haveOwnProperty('method')
    })

    finallyCleanUpWallet(context)
  })

  describe('creating did', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)

    it('should create a did', async function () {
      const response = await createDid(context, {
        method: 'sov',
        options: {
          key_type: 'ed25519',
        },
      })
      expect(response.status).to.equal(200)
      expect(response.body.result.did).to.be.a('String')
    })

    finallyCleanUpWallet(context)
  })

  describe('creating did with invalid body', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)
    withExistingWallet(context)

    it('should create a did', async function () {
      const response = await createDid(context, {
        method: 'invalid',
        options: {
          key_type: 'ed25519',
        },
      })
      expect(response.status).to.equal(422)
      expect(response.body).to.haveOwnProperty('method')
    })

    finallyCleanUpWallet(context)
  })
})
