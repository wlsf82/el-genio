const fs = require('fs');
const path = require('path');

// Helper function to process test results and create standardized response
const processTestResults = (results, req) => {
  // Extract failed tests (handling both single run and multiple runs cases)
  const tests = results.runs.length === 1
    ? results.runs[0].tests
    : results.runs.flatMap(run => run.tests);

  const failedTests = tests
    .filter(test => test.state === 'failed')
    .map(test => ({
      title: test.title.join(' > '),
      error: test.displayError.replace(/at Context\.eval.*$/m, '').trim()
    }));

  // Build response object
  const response = {
    success: results.totalFailed === 0,
    message: results.totalFailed === 0
      ? 'All tests passed! ✅'
      : `${results.totalFailed} test(s) failed. ❌`,
    details: {
      totalTests: results.totalTests,
      totalPassed: results.totalPassed,
      totalFailed: results.totalFailed
    },
    failedTests
  };

  // Always check if screenshots exist for this run
  const screenshotsDir = path.join(__dirname, '..', 'cypress', 'screenshots');
  let screenshotsExist = false;
  try {
    screenshotsExist = fs.existsSync(screenshotsDir) && fs.readdirSync(screenshotsDir).length > 0;
  } catch (e) {
    screenshotsExist = false;
  }

  if (screenshotsExist) {
    response.screenshotsLink = `${req.protocol}://${req.get('host')}/cypress/screenshots/download`;
  }

  // Check if videos exist for this run
  const videosDir = path.join(__dirname, '..', 'cypress', 'videos');
  let videosExist = false;
  try {
    videosExist = fs.existsSync(videosDir) && fs.readdirSync(videosDir).length > 0;
  } catch (e) {
    videosExist = false;
  }

  if (videosExist) {
    response.videosLink = `${req.protocol}://${req.get('host')}/cypress/videos/download`;
  }

  return response;
};

module.exports = {
  processTestResults
};
