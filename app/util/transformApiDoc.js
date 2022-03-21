const WALLET_CREATE_PATH = '/multitenancy/wallet'

const removePathsWithPrefix = (prefix) => (apiDoc) => {
  const { paths, ...rest } = apiDoc
  const filteredPaths = Object.fromEntries(Object.entries(paths).filter(([path]) => !path.startsWith(prefix)))
  return { paths: filteredPaths, ...rest }
}
const removeMultitenancy = removePathsWithPrefix('/multitenancy')

const updateInfo = (apiDoc, info) => {
  return Object.assign({}, apiDoc, { info })
}

const updateSecurityDefs = (apiDoc) => {
  const securitySchemes = {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Auth0 JWT',
    },
  }
  const components = Object.assign({}, apiDoc.components, { securitySchemes })
  const security = [{ bearerAuth: [] }]
  apiDoc = Object.assign({}, apiDoc, { components, security })
  return apiDoc
}

const prefixBasePaths = (apiDoc, prefix) => {
  const { paths, ...rest } = apiDoc
  const transformedPaths = Object.fromEntries(Object.entries(paths).map(([path, obj]) => [`${prefix}${path}`, obj]))
  return { paths: transformedPaths, ...rest }
}

const removeComponentSchemaProperty = (apiDoc, schemaName, propertyName) => {
  const { properties: origProps, required: origRequired, ...schemaRest } = apiDoc.components.schemas[schemaName]
  const newProps = { ...origProps }
  delete newProps[propertyName]
  const newRequired = origRequired === undefined ? undefined : [...origRequired].filter((req) => req !== propertyName)
  const schema = Object.assign({}, schemaRest, { properties: newProps }, newRequired && { required: newRequired })
  const schemas = {
    ...apiDoc.components.schemas,
    [schemaName]: schema,
  }
  const components = {
    ...apiDoc.components,
    schemas,
  }
  return { ...apiDoc, components }
}

const updateCreateWalletComponents = (apiDoc) => {
  apiDoc = removeComponentSchemaProperty(apiDoc, 'CreateWalletRequest', 'wallet_name')
  apiDoc = removeComponentSchemaProperty(apiDoc, 'CreateWalletResponse', 'wallet_id')
  apiDoc = removeComponentSchemaProperty(apiDoc, 'CreateWalletResponse', 'token')
  return apiDoc
}

const transformApiDoc = (apiDoc, options) => {
  const walletCreatePathSpec = apiDoc.paths[WALLET_CREATE_PATH].post
  apiDoc = removeMultitenancy(apiDoc)
  apiDoc.paths[WALLET_CREATE_PATH] = { post: walletCreatePathSpec }

  apiDoc = prefixBasePaths(apiDoc, options.pathPrefix)

  apiDoc = updateInfo(apiDoc, { title: options.title, version: options.version })
  apiDoc = updateSecurityDefs(apiDoc)

  apiDoc = updateCreateWalletComponents(apiDoc)

  return apiDoc
}

module.exports = transformApiDoc
