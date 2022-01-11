const { describe, before, test } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { API_VERSION } = require('../../app/env')
const { healthCheck } = require('../helper/routeHelper')

describe('health', function () {
  let app

  before(async function () {
    app = await createHttpServer()
  })

  test('health check', async function () {
    const expectedResult = { status: 'ok', version: API_VERSION }

    const actualResult = await healthCheck(app)
    expect(actualResult.status).to.equal(200)
    expect(actualResult.body).to.deep.equal(expectedResult)
  })
})
