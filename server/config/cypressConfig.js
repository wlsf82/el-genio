const path = require('path');

const browser = process.platform === 'linux' ? 'chromium' : 'chrome';

// Define default Cypress options
const defaultCypressOptions = {
  browser,
  headed: false,
  configFile: path.join(__dirname, '../', 'cypress.config.js'),
};

module.exports = {
  defaultCypressOptions
};
