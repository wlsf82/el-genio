const path = require('path');

// Define default Cypress options
const defaultCypressOptions = {
  browser: 'chromium',
  headed: false,
  configFile: path.join(__dirname, '../', 'cypress.config.js'),
};

module.exports = {
  defaultCypressOptions
};
