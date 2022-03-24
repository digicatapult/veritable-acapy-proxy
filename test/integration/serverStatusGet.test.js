const { describe, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { serverStatus, serverStatusUnauthorized } = require('../helper/routeHelper')
const { withAuthToken } = require('../helper/auth0')

describe('server status', function () {
  describe('unauthenticated', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })

    it('should fail with 401', async function () {
      const response = await serverStatusUnauthorized(context)
      expect(response.status).to.equal(401)
    })
  })

  describe('server status without a wallet', function () {
    const context = {}
    before(async function () {
      context.app = (await createHttpServer()).app
    })
    withAuthToken(context)

    it('should succeed and return server status', async function () {
      const response = await serverStatus(context)
      expect(response.status).to.equal(200)
      expect(response.body.version).to.be.a('String')
    })
  })
})
