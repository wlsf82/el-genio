# el-genio

[![CI](https://github.com/wlsf82/el-genio/actions/workflows/ci.yml/badge.svg)](https://github.com/wlsf82/el-genio/actions/workflows/ci.yml)

A no-code testing app that uses [Cypress](https://cypress.io) in the background to create and run tests.

## Pre-requirements

To clone and run the app, you must have [git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), and npm installed on your computer.

I've used the following version of the systems mentioned above:

- git `2.42.1`
- Node.js `v22.13.1`
- npm `10.9.2`

> There's no need to install npm since it's automatically installed when installing Node.js.

## Installation

Run `npm run install:all` to install all the necessary dependencies.

## Running the app

Run `npm start` to start the client and server.

> The command above will start both client and server in development mode.

To start the server in production mode, run `npm run server`. In this case, the client needs be be started separetedly with `npm run client`.

After the app is started you should be able to access it locally at `http://localhost:5173/`.

### Using Docker (server-side only)

For the server-side, it's possible to use Docker.

> In this case, Docker is required.

To run the server using Docker, follow the below steps.

1. `cd server/`
2. `docker build -t el-genio-server .`
3. `docker run -d -p 3003:3003 -v $(pwd)/cypress/e2e:/usr/src/server/cypress/e2e el-genio-server`

### Tests

With the app up-and-running, you can now run tests in both headless and interactive mode.

Run `npm test` to run the tests in headless mode.

Or, run `npm run cy:open` to open the Cypress App and run the tests in interactive mode.

___

Powered by [Talking About Testing](https://talkingabouttesting.com/).
