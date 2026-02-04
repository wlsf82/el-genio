const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Do not disable it yet since @cypress/grep@5.x.x still requires it, and @cypress/grep@6.x.x is not available yet.
  allowCypressEnv: true,
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: false,
    viewportHeight: 1280,
    viewportWidth: 1800,
    video: true,
    setupNodeEvents(on, config) {
      const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin')
      cypressGrepPlugin(config)
      return config
    },
  },
});
