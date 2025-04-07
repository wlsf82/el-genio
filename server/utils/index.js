const { generateCypressTestFile } = require('./generateCypressTestFile');
const { parseCypressTestFile } = require('./parseCypressTestFile');
const { processTestResults } = require('./processTestResults');

module.exports = {
  generateCypressTestFile,
  parseCypressTestFile,
  processTestResults,
};
