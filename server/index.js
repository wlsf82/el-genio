const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cypress = require('cypress');
const archiver = require('archiver');

const { generateCypressTestFile, parseCypressTestFile } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Store test suites in memory (in a real app, use a database)
const testSuites = {};

// API routes
app.get('/api/test-suites', (req, res) => {
  const suites = Object.values(testSuites);
  res.json(suites);
});

app.get('/api/test-suites/:id', (req, res) => {
  const suite = testSuites[req.params.id];
  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }
  res.json(suite);
});

app.post('/api/test-suites', async (req, res) => {
  try {
    const { name, testCases } = req.body;

    if (!name || !testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: 'Invalid test suite data' });
    }

    const id = uuidv4();
    const newSuite = { id, name, testCases, createdAt: new Date() };
    testSuites[id] = newSuite;

    // Generate Cypress test file
    await generateCypressTestFile(newSuite);

    res.status(201).json(newSuite);
  } catch (error) {
    console.error('Error creating test suite:', error);
    res.status(500).json({ message: 'Failed to create test suite', error: error.message });
  }
});

app.put('/api/test-suites/:id', async (req, res) => {
  const id = req.params.id;
  const { name, testCases } = req.body;

  if (!name || !testCases || !Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ message: 'Invalid test suite data' });
  }

  const suite = testSuites[id];
  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    // Update the test suite in memory
    suite.name = name;
    suite.testCases = testCases;

    // Regenerate the Cypress test file
    await generateCypressTestFile(suite);

    res.json(suite);
  } catch (error) {
    console.error('Error updating test suite:', error);
    res.status(500).json({ message: 'Failed to update test suite', error: error.message });
  }
});

app.delete('/api/test-suites/:id', async (req, res) => {
  const id = req.params.id;
  const suite = testSuites[id];

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    // Delete the corresponding Cypress test file
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const filePath = path.join(__dirname, 'cypress', 'e2e', filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Could not delete file ${filePath}:`, err);
    }

    delete testSuites[id];
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting test suite:', error);
    res.status(500).json({ message: 'Failed to delete test suite', error: error.message });
  }
});

app.post('/api/test-suites/run-all', async (req, res) => {
  try {
    const configFilePath = path.join(__dirname, './', 'cypress.config.js');
    const specPattern = path.join(__dirname, 'cypress', 'e2e', '**', '*.cy.js');

    let cypressOptions = {
      browser: 'chrome',
      headed: false,
      configFile: configFilePath,
      spec: specPattern
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
});

app.post('/api/test-suites/:id/run', async (req, res) => {
  const id = req.params.id;
  const suite = testSuites[id];
  const { grepTags } = req.body; // Get the selected test titles

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    const configFilePath = path.join(__dirname, './', 'cypress.config.js');
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const specFilePath = path.join(__dirname, 'cypress', 'e2e', filename);

    try {
      await fs.access(specFilePath);
    } catch (err) {
      console.error(`Test file not found: ${specFilePath}`);
      return res.status(500).json({
        message: 'Test file not found',
        error: err.message,
        success: false
      });
    }

    let cypressOptions = {
      browser: 'chrome',
      headed: false,
      configFile: configFilePath,
      spec: specFilePath,
      env: {
        grepFilterSpecs: true,
        grepOmitFiltered: true
      }
    };

    // Add grep options if specific tests are selected
    if (grepTags && grepTags.length > 0) {
      cypressOptions.env.grep = grepTags.join(';');
    }

    console.log(`Running Cypress test with spec: ${specFilePath}`);
    const results = await cypress.run(cypressOptions);

    // Extract stack traces for failed tests
    const failedTests = results.runs[0].tests
      .filter(test => test.state === 'failed')
      .map(test => ({
        title: test.title.join(' > '), // Combine test titles
        error: test.displayError.replace(/at Context\.eval.*$/m, '').trim() // Remove unwanted stack trace part
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
      failedTests // Include failed tests with stack traces
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
});

// Serve Cypress screenshots folder
app.use('/cypress/screenshots', express.static(path.join(__dirname, 'cypress', 'screenshots')));

// Route to download the entire screenshots directory as a zip file
app.get('/cypress/screenshots/download', async (req, res) => {
  const screenshotsDir = path.join(__dirname, 'cypress', 'screenshots');

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
});

// Function to load existing test suites from Cypress files
async function loadExistingTestSuites() {
  try {
    const cypressE2ePath = path.join(__dirname, 'cypress', 'e2e');
    const files = await fs.readdir(cypressE2ePath);
    const testFiles = files.filter(file => file.endsWith('.cy.js'));

    for (const file of testFiles) {
      // Extract ID from filename (assumes format name_id.cy.js)
      const idMatch = file.match(/_([0-9a-f-]+)\.cy\.js$/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];

        // If this test suite is not already in memory, load basic info
        if (!testSuites[id]) {
          const fileContent = await fs.readFile(path.join(cypressE2ePath, file), 'utf8');

          // Extract test suite name from comment or describe block
          let name = 'Unknown Test Suite';
          const nameMatch = fileContent.match(/Test Suite: (.*?)$|describe\('(.*?)'/m);
          if (nameMatch) {
            name = nameMatch[1] || nameMatch[2];
          }

          // Parse test cases from file content
          const testCases = await parseCypressTestFile(fileContent);

          // Create test suite object with parsed test cases
          testSuites[id] = {
            id,
            name,
            createdAt: new Date(),
            testCases
          };

          console.log(`Loaded existing test suite: ${name} (${id}) with ${testCases.length} test cases`);
        }
      }
    }
  } catch (error) {
    console.error('Error loading existing test suites:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Create cypress/e2e directory if it doesn't exist
  const cypressE2ePath = path.join(__dirname, 'cypress', 'e2e');
  await fs.mkdir(cypressE2ePath, { recursive: true });

  // Load existing test suites from disk
  await loadExistingTestSuites();
});
