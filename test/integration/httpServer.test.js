const { describe, before, it } = require('mocha')
const { expect } = require('chai')

const { setupServer } = require('./helpers/server')
const { API_VERSION } = require('../app/env')

describe('health', function () {
  const context = {}

  before(async function () {
    await setupServer(context)
    context.response = await context.request.get('/health')
  })

  it('should return 200', function () {
    expect(context.response.status).to.equal(200)
  })

  it('should return success', function () {
    expect(context.response.body).to.deep.equal({ version: API_VERSION, status: 'ok' })
  })
})
