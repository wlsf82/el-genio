const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    fixturesFolder: false,
    viewportHeight: 1280,
    viewportWidth: 1800,
  },
});
