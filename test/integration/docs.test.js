const { describe, before, it } = require('mocha')
const jsonChai = require('chai-json')
const { expect } = require('chai').use(jsonChai)

const { setupServer } = require('../helpers/server')
const { API_MAJOR_VERSION } = require('../../app/env')

describe('api-docs', function () {
  const context = {}

  before(async function () {
    await setupServer(context)
    context.response = await context.request.get(`/${API_MAJOR_VERSION}/api-docs`)
  })

  it('should return 200', function () {
    expect(context.response.status).to.equal(200)
  })

  it('successfully returns the api docs json', function () {
    expect(context.response.body).to.be.a.jsonObj()
    expect(JSON.stringify(context.response.body)).to.include('openapi')
    expect(JSON.stringify(context.response.body)).to.include('info')
  })
})
