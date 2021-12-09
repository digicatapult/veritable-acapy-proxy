const request = require('supertest')

const { createHttpServer } = require('../../app/server')

let server = null
const setupServer = async (context) => {
  if (!server) {
    server = await createHttpServer()
  }
  context.request = request(server.app)
}

module.exports = { setupServer }
