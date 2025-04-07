const path = require('path');
const cypress = require('cypress');
const archiver = require('archiver');
const fs = require('fs').promises;
const { defaultCypressOptions } = require('../config/cypressConfig');
const { testSuites } = require('./testSuiteController');

// Run all test suites
const runAllTestSuites = async (req, res) => {
  try {
    const specPattern = path.join(__dirname, '..', 'cypress', 'e2e', '**', '*.cy.js');

    const cypressOptions = {
      ...defaultCypressOptions,
      spec: specPattern,
    };

    console.log('Running all Cypress tests');
    const results = await cypress.run(cypressOptions);

    // Extract stack traces for failed tests
    const failedTests = results.runs
      .flatMap(run => run.tests)
      .filter(test => test.state === 'failed')
      .map(test => ({
        title: test.title.join(' > '),
        error: test.displayError.replace(/at Context\.eval.*$/m, '').trim()
      }));

    // Simplified result
    const response = {
      success: results.totalFailed === 0,
      message: results.totalFailed === 0
        ? 'All tests passed! ✅'
        : `${results.totalFailed} test(s) failed. ❌`,
      details: {
        totalTests: results.totalTests,
        totalPassed: results.totalPassed,
        totalFailed: results.totalFailed,
        totalPending: results.totalPending,
        totalSkipped: results.totalSkipped
      },
      failedTests
    };

    // Include screenshots link if tests failed
    if (results.totalFailed > 0) {
      response.screenshotsLink = `${req.protocol}://${req.get('host')}/cypress/screenshots/download`;
    }

    res.json(response);
  } catch (error) {
    console.error('Error running all test suites:', error);
    res.status(500).json({
      message: 'Failed to run test suites',
      error: error.message,
      success: false
    });
  }
};

// Run a specific test suite
const runTestSuite = async (req, res) => {
  const id = req.params.id;
  const suite = testSuites[id];
  const { grepTags } = req.body;

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const specFilePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

    try {
      await fs.access(specFilePath);
    } catch (err) {
      console.error(`Test file not found: ${specFilePath}`);
      return res.status(500).json({
        message: 'Test file not found',
        error: err.message,
        success: false,
      });
    }

    const cypressOptions = {
      ...defaultCypressOptions,
      spec: specFilePath,
      env: {
        grepFilterSpecs: true,
        grepOmitFiltered: true,
        ...(grepTags && grepTags.length > 0 ? { grep: grepTags.join(';') } : {}),
      },
    };

    console.log(`Running Cypress test with spec: ${specFilePath}`);
    const results = await cypress.run(cypressOptions);

    // Extract stack traces for failed tests
    const failedTests = results.runs[0].tests
      .filter(test => test.state === 'failed')
      .map(test => ({
        title: test.title.join(' > '),
        error: test.displayError.replace(/at Context\.eval.*$/m, '').trim()
      }));

    // Simplified result
    const response = {
      success: results.totalFailed === 0,
      message: results.totalFailed === 0
        ? 'All tests passed! ✅'
        : `${results.totalFailed} test(s) failed. ❌`,
      details: {
        totalTests: results.totalTests,
        totalPassed: results.totalPassed,
        totalFailed: results.totalFailed,
        totalPending: results.totalPending,
        totalSkipped: results.totalSkipped
      },
      failedTests
    };

    // Include screenshots link if tests failed
    if (results.totalFailed > 0) {
      response.screenshotsLink = `${req.protocol}://${req.get('host')}/cypress/screenshots/download`;
    }

    res.json(response);
  } catch (error) {
    console.error('Error running test suite:', error);
    res.status(500).json({
      message: 'Failed to run test suite',
      error: error.message,
      success: false
    });
  }
};

// Download screenshots as zip
const downloadScreenshots = async (req, res) => {
  const screenshotsDir = path.join(__dirname, '..', 'cypress', 'screenshots');

  // Check if the screenshots directory exists
  try {
    await fs.access(screenshotsDir);
  } catch (err) {
    return res.status(404).json({ message: 'Screenshots directory not found' });
  }

  // Set headers for the response
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=screenshots.zip');

  // Create a zip archive and pipe it to the response
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  // Add the screenshots directory to the archive
  archive.directory(screenshotsDir, false);

  // Finalize the archive
  archive.finalize();
};

module.exports = {
  runAllTestSuites,
  runTestSuite,
  downloadScreenshots
};
