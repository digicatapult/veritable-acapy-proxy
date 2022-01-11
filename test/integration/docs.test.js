const { describe, before, it } = require('mocha')
const jsonChai = require('chai-json')
const { expect } = require('chai').use(jsonChai)

const { createHttpServer } = require('../../app/server')
const { apiDocs } = require('../helper/routeHelper')

describe('api-docs', function () {
  let app

  before(async function () {
    app = await createHttpServer()
  })

  it('should return 200', async function () {
    const actualResult = await apiDocs(app)

    expect(actualResult.status).to.equal(200)
    expect(actualResult.body).to.be.a.jsonObj()
    expect(JSON.stringify(actualResult.body)).to.include('openapi')
    expect(JSON.stringify(actualResult.body)).to.include('info')
  })
})
