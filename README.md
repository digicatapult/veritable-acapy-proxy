# vitalam-service-template

Template repository for bootstrapping new VITALam services. Use this repo as a template in github when creating new `VITALam` services. When forked a new pull request will automatically be created in the new repository to apply templating. Before merging you should also give access to the forked repo the `GITHUB_TOKEN` organisation secret prior to merging. This will allow the release workflow to run successfully on merging.

## What this repo provides

This repo provides:

- basic node.js project structure for a VITALam service
- linting with VITALam prettier configuration
- open-sourcing materials
- Docker file
- A simple helm chart for the service
- A service with a healthcheck endpoint on `/health`
- Testing apparatus using `mocha`, `chai` and `supertest`
- Github workflows for testing and release

## Environment Variables

`vitalam-service-template` is configured primarily using environment variables as follows:

|           variable            | required | default | description                                                                                                          |
| :---------------------------- | :------: | :-----: | :------------------------------------------------------------------------------------------------------------------- |
| SERVICE_TYPE                  |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]                                 |
| PORT                          |    N     | `3001`  | The port for the API to listen on                                                                                    |
| API_HOST                      |    Y     |    -    | The hostname of the `vitalam-node` the API should connect to                                                         |
| API_PORT                      |    N     | `9944`  | The port of the `vitalam-node` the API should connect to                                                             |
| LOG_LEVEL                     |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]                                 |
| USER_URI                      |    Y     |    -    | The Substrate `URI` representing the private key to use when making `vitalam-node` transactions                      |
| AUTH_JWKS_URI                 |    Y     |    -    | JSON Web Key Set containing public keys used by the Auth0 API e.g. `https://test.eu.auth0.com/.well-known/jwks.json` |
| AUTH_AUDIENCE                 |    Y     |    -    | Identifier of the Auth0 API                                                                                          |
| AUTH_ISSUER                   |    Y     |    -    | Domain of the Auth0 API e.g. `https://test.eu.auth0.com/`                                                            |
| AUTH_TOKEN_URL                |    Y     |    -    | Auth0 API endpoint that issues an Authorisation (Bearer) access token e.g. `https://test.auth0.com/oauth/token`      |
| METADATA_KEY_LENGTH           |    N     |  `32`   | Fixed length of metadata keys                                                                                        |
| METADATA_VALUE_LITERAL_LENGTH |    N     |  `32`   | Fixed length of metadata LITERAL values                                                                              |
| API_VERSION                   |    N     |    -    | API version                                                                                                          |
| API_MAJOR_VERSION             |    N     |    -    | API major version                                                                                                    |
