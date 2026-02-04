const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      apiUrl: 'http://localhost:3003/api',
    },
    viewportHeight: 1024,
    viewportWidth: 1280,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
