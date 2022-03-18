# veritable-acapy-proxy

Proxy service for aca-py cloud wallets. [aries-cloudagent-python](https://github.com/hyperledger/aries-cloudagent-python) (also known as aca-py) is a cloud based wallet service for SSI implementations. The architecture of aca-py does not however allow a frontend to connect directly to it safely as this would expose all necessary API authentication details. This service acts an authenticated shim for aca-py such that it can be used safely as a multi-tenant cloud wallet.

## Architecture

The `veritable-acapy-proxy` is a gateway service for [aca-py](https://github.com/hyperledger/aries-cloudagent-python)
 designed to enable safe exposure of a multi-tenant `aca-py` instance to end users. It uses a configured JWT authentication provider (such as Auth0) to authenticate a user and then allows that user to create a single wallet for themselves and to then instruct that wallet to perform SSI actions. The basic workflow is as follows:

![architecture](readme-assets/architecture.svg)

## Environment Variables

`veritable-acapy-proxy` is configured primarily using environment variables as follows:

| variable                      | required | default | description                                                                                     |
| :---------------------------- | :------: | :-----: | :---------------------------------------------------------------------------------------------- |
| SERVICE_TYPE                  |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| PORT                          |    N     | `3001`  | The port for the API to listen on                                                               |
| LOG_LEVEL                     |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| API_VERSION                   |    N     |    -    | API version                                                                                     |
| API_MAJOR_VERSION             |    N     |    -    | API major version                                                                               |

<!-- TODO update envs -->

## Development setup

<!-- TODO document development setup -->
