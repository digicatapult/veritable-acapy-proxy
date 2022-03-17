# veritable-acapy-proxy

Proxy service for aca-py cloud wallets. [aries-cloudagent-python](https://github.com/hyperledger/aries-cloudagent-python) (also known as aca-py) is a cloud based wallet service for SSI implementations. The architecture of aca-py does not however allow a frontend to connect directly to it safely as this would expose all necessary API authentication details. This service acts an authenticated shim for aca-py such that it can be used safely as a multi-tenant cloud wallet.

## Environment Variables

`veritable-acapy-proxy` is configured primarily using environment variables as follows:

| variable                      | required | default | description                                                                                     |
| :---------------------------- | :------: | :-----: | :---------------------------------------------------------------------------------------------- |
| SERVICE_TYPE                  |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| PORT                          |    N     | `3001`  | The port for the API to listen on                                                               |
| LOG_LEVEL                     |    N     | `info`  | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]            |
| API_VERSION                   |    N     |    -    | API version                                                                                     |
| API_MAJOR_VERSION             |    N     |    -    | API major version                                                                               |
