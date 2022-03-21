const { describe, it } = require('mocha')
const { expect } = require('chai')

const transform = require('../../app/util/transformApiDoc')
const input = require('./data/input.json')
const expectation1 = require('./data/expectation-1.json')
const expectation2 = require('./data/expectation-2.json')

describe('transformApiDoc', function () {
  it('should transform input -> expectation (case 1)', function () {
    expect(transform(input, { title: 'TITLE-1', version: '1.0.0', pathPrefix: '/prefix-1' })).to.deep.equal(
      expectation1
    )
  })

  it('should transform input -> expectation (case 2)', function () {
    expect(transform(input, { title: 'TITLE-2', version: '2.0.0', pathPrefix: '/prefix-2' })).to.deep.equal(
      expectation2
    )
  })
})
