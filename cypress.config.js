const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportHeight: 1024,
    viewportWidth: 1280,
  },
});
