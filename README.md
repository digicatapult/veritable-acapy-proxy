# veritable-acapy-proxy

## Deprecation Notice
This application was deprecated on March 14th 2024, there will be no further dependency or security updates.
---

Proxy service for aca-py cloud wallets. [aries-cloudagent-python](https://github.com/hyperledger/aries-cloudagent-python) (also known as aca-py) is a cloud based wallet service for SSI implementations. The architecture of aca-py does not however allow a frontend to connect directly to it safely as this would expose all necessary API authentication details (see [this issue](https://github.com/hyperledger/aries-cloudagent-python/issues/1632) for details). This service acts an authenticated shim for aca-py such that it can be used safely as a multi-tenant cloud wallet.

## Architecture

The `veritable-acapy-proxy` is a gateway service for [aca-py](https://github.com/hyperledger/aries-cloudagent-python)
designed to enable safe exposure of a multi-tenant `aca-py` instance to an end user web-frontend. It uses a configured JWT authentication provider (such as [`Auth0`](https://auth0.com/)) to authenticate a user and then allows that user to create a single wallet for themselves and to then instruct that wallet to perform SSI actions. The basic workflow is as follows:

![architecture](readme-assets/architecture.svg)

## Environment Variables

`veritable-acapy-proxy` is configured primarily using environment variables as follows:

| variable            | required |         default         | description                                                                                                               |
| :------------------ | :------: | :---------------------: | :------------------------------------------------------------------------------------------------------------------------ |
| SERVICE_TYPE        |    N     | `VERITABLE_ACAPY_PROXY` | Name of this service                                                                                                      |
| PORT                |    N     |         `3000`          | The port for the API to listen on                                                                                         |
| LOG_LEVEL           |    N     |         `info`          | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]                                      |
| API_VERSION         |    N     |  Set by `package.json`  | API version                                                                                                               |
| API_MAJOR_VERSION   |    N     |          `v1`           | API major version                                                                                                         |
| SERVICE_HOST        |    Y     |                         | Host on which this service is publicly served. Used for advertising the OpenAPI spec                                      |
| SERVICE_PORT        |    N     |          `80`           | Port on which this service is publicly served. Used for advertising the OpenAPI spec                                      |
| ACAPY_API_KEY       |    Y     |                         | Admin apikey for the `aca-py` service                                                                                     |
| ACAPY_ADMIN_SERVICE |    Y     |                         | Origin for the `aca-py` service, for example `http://localhost:8001`                                                      |
| AUTH_AUDIENCE       |    Y     |                         | `JWT` audience to check claim for                                                                                         |
| AUTH_ISSUER         |    Y     |                         | Issuer URL for the `JWT`. Note it is assumed that the jwks config will be found at `${AUTH_ISSUER}/.well-known/jwks.json` |

Environment variables are additionally loaded from a `.env` file in the root of this repository which is gitignored.

## Development setup

In order to develop `veritable-acapy-proxy` and run the tests you'll need the following local tooling:

1. `nodejs` version `16` or later
2. `npm` version `8` or later
3. `docker` version `20.10` or later
4. `docker-compose` version `1.29` or later

With that done you can bring up an `aca-py` instance for testing against using:

```sh
docker-compose up -d
```

Install dependencies with

```sh
npm install
```

And finally run the tests with

```sh
npm run test
```

A code coverage report can also be generated with

```sh
npm run coverage
```
