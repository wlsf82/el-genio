# el-genio

[![CI](https://github.com/wlsf82/el-genio/actions/workflows/ci.yml/badge.svg)](https://github.com/wlsf82/el-genio/actions/workflows/ci.yml)

A no-code testing app that uses [Cypress](https://cypress.io) in the background to create and run tests.

## Pre-requirements

To clone and run the app, you must have [git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), npm, and [Docker](https://www.docker.com/products/docker-desktop/) installed on your computer.

I've used the following version of the systems mentioned above:

- git `2.42.1`
- Node.js `v22.13.1`
- npm `10.9.2`
- Docker `28.3.0`

> There's no need to install npm since it's automatically installed when installing Node.js.

## Installation

Run `npm run install:all` to install all the necessary dependencies.

## Running the app

The _El Genio_ app is composed of a React app, an Express.js server, and a Postgres database.

### Server and Database

You can run both the server and database using Docker.

#### Create a Docker Network

First, create a Docker network to allow the containers to communicate:

```bash
docker network create el-genio-network
```

#### Building and running the database

To build and run the database container:

1. `cd postgres/`
2. `docker build -t el-genio-db .`
3. `docker run -d -p 5432:5432 --network el-genio-network --name postgres el-genio-db`

The database will be initialized with the following default settings:

- Username: postgres
- Password: postgres
- Database name: elgenio
- Port: 5432

> **Note:** The container must be named "postgres" for the server to connect to it.

#### Building and running the server

To build and run the server container:

1. `cd server/`
2. `docker build -t el-genio-server .`
3. `docker run -d -p 3003:3003 --network el-genio-network -v $(pwd)/cypress/e2e:/usr/src/server/cypress/e2e el-genio-server`

> **Important:** Make sure to run the database container before the server container.

### Client

Run `npm run client` to start the client app.

After the app is started, you should be able to access it locally at `http://localhost:5173/`.

### Tests

With the app up-and-running, you can now run tests in both headless and interactive mode.

Run `npm test` to run the tests in headless mode.

Or, run `npm run cy:open` to open the Cypress App and run the tests in interactive mode.

## Contributing

There are different ways to contribute to the El Genio project, such as testing it, finding and reporting bugs, suggesting new features, or even fixing bugs and implementing new features yourself.

Below is the process you should follow depending on how you want to contribute.

### Testing El Genio

If you want to test El Genio:

1. Clone the project;
2. Read [the docs](./README.md) to setup El Genio locally;
3. Test it out by creating and running your tests using our no-code testing solution;
4. After playing with El Genio, open issues to report bugs or feature suggestions.

> **Note:** Make sure to look into the [existing issues](https://github.com/wlsf82/el-genio/issues) before opening a new one, and when opening an issue, please provide us with as much details as possible.

### Fixing bugs and implementing new features

If you want to contribute to this project by fixing bugs or implementing new features:

1. Choose an [issue](https://github.com/wlsf82/el-genio/issues) to work on;
2. Fork the project;
3. Clone your fork and make the necessary changes;
4. Test your changes locally, and move on only when all tests are green;
   4.1. If adding new features, make sure to add the appropriate tests for it;
5. Push your changes to GitHub and create a pull request (PR);
6. After the GitHub Workflow of your PR is green, tag `@wlsf82`, ask for review, and wait for feedback;
7. If everything goes well, you should have your changes rebased and merged to the main branch. Otherwise, you will receive comments with adjustments needed before merging.

> [This is the commit messaging guidelines you should follow](https://cbea.ms/git-commit/).

___

Powered by [Talking About Testing](https://talkingabouttesting.com/).
