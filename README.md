# test-genie

[![CI](https://github.com/wlsf82/test-genie/actions/workflows/ci.yml/badge.svg)](https://github.com/wlsf82/test-genie/actions/workflows/ci.yml)

A no-code testing app that uses Cypress in the background to create and run tests.

## Pre-requirements

You must have [git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), and npm installed on your computer to clone and run the app.

I've used the following version of the systems mentioned above:

- git `2.42.1`
- Node.js `v22.13.1`
- npm `10.9.2`

> There's no need to install npm since it's automatically installed when installing Node.js.

## Installation

Run `npm run install:all` to install all the necessary dependencies.

## Tests

Run `npm test` to run the tests in headless mode.

Or, run `npm cy:open` to open the Cypress App and run the tests in interactive mode.

## Running the app

Run `npm start` to start the client and server.

After the app is started you should be able to access it locally at `http://localhost:5173/`.

___

Powered by [Talking About Testing](https://talkingabouttesting.com/).
