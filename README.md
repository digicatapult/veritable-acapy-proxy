# veritable-acapy-proxy

Template repository for bootstrapping new VITALam services. Use this repo as a template in github when creating new `VITALam` services. When forked a new pull request will automatically be created in the new repository to apply templating. Before merging you should also give access to the forked repo the `GITHUB_TOKEN` organisation secret prior to merging. This will allow the release workflow to run successfully on merging.

## What this repo provides

This repo provides:

- basic node.js project structure for a VITALam service
- linting with VITALam prettier configuration
- open-sourcing materials
- Docker file
- A simple helm chart for the service
- A service with a healthcheck endpoint on `/health`
- An OpenAPI doc and endpoints for `/swagger` and `/api-docs`
- Testing apparatus using `mocha`, `chai` and `supertest`
- Github workflows for testing and release

## Environment Variables

`veritable-acapy-proxy` is configured primarily using environment variables as follows:

| variable                      | required | default | description                                                                                     |
| :---------------------------- | :------: | :-----: | :---------------------------------------------------------------------------------------------- |
| SERVICE_TYPE                  |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| PORT                          |    N     | `3001`  | The port for the API to listen on                                                               |
| LOG_LEVEL                     |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| API_VERSION                   |    N     |    -    | API version                                                                                     |
| API_MAJOR_VERSION             |    N     |    -    | API major version                                                                               |
