/* eslint no-console: "off" */
const request = require('supertest')

const { API_MAJOR_VERSION } = require('../../app/env')

async function apiDocs({ app }) {
  return request(app)
    .get(`/${API_MAJOR_VERSION}/api-docs`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function healthCheck({ app }) {
  return request(app)
    .get('/health')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function createWallet({ app, token }, body) {
  return request(app)
    .post(`/${API_MAJOR_VERSION}/aca-py/multitenancy/wallet`)
    .set('Accept', 'application/json, text/plain')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function createWalletUnauthorized({ app }, body) {
  return request(app)
    .post(`/${API_MAJOR_VERSION}/aca-py/multitenancy/wallet`)
    .set('Accept', 'application/json, text/plain')
    .set('Content-Type', 'application/json')
    .send(body)
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function listDids({ app, token }, query = {}) {
  return request(app)
    .get(`/${API_MAJOR_VERSION}/aca-py/wallet/did`)
    .query(query)
    .set('Accept', 'application/json, text/plain')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function listDidsUnauthorized({ app }, query = {}) {
  return request(app)
    .get(`/${API_MAJOR_VERSION}/aca-py/wallet/did`)
    .query(query)
    .set('Accept', 'application/json, text/plain')
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function serverStatus({ app, token }, query = {}) {
  return request(app)
    .get(`/${API_MAJOR_VERSION}/aca-py/status`)
    .query(query)
    .set('Accept', 'application/json, text/plain')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function serverStatusUnauthorized({ app }, query = {}) {
  return request(app)
    .get(`/${API_MAJOR_VERSION}/aca-py/status`)
    .query(query)
    .set('Accept', 'application/json, text/plain')
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

async function createDid({ app, token }, body) {
  return request(app)
    .post(`/${API_MAJOR_VERSION}/aca-py/wallet/did/create`)
    .set('Accept', 'application/json, text/plain')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.error(`healthCheckErr ${err}`)
      return err
    })
}

module.exports = {
  apiDocs,
  healthCheck,
  createWalletUnauthorized,
  createWallet,
  listDids,
  listDidsUnauthorized,
  serverStatus,
  serverStatusUnauthorized,
  createDid,
}
