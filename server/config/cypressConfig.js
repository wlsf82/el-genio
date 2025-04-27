const path = require('path');

const browser = process.platform === 'linux' ? 'chromium' : 'chrome';

// Define default Cypress options
const defaultCypressOptions = {
  browser,
  headed: false,
  configFile: path.join(__dirname, '../', 'cypress.config.js'),
  config: {
    defaultCommandTimeout: 4000 // Explicitly set the default so it's clear what we're overriding
  }
};

module.exports = {
  defaultCypressOptions
};
