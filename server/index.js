const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cypress = require('cypress');
const archiver = require('archiver'); // Import archiver

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

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    const configFilePath = path.join(__dirname, './', 'cypress.config.js');

    // Get the path to the existing test file
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const specFilePath = path.join(__dirname, 'cypress', 'e2e', filename);

    // Verify the file exists
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
      spec: specFilePath
    };

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

// Function to generate Cypress test file with filtering capability
async function generateCypressTestFile(testSuite) {
  const { id, name, testCases } = testSuite;

  let testFileContent = `
// Auto-generated Cypress test file
// Test Suite: ${name}

describe("${name.replace(/"/g, '\\"')}", () => {
`;

  testCases.forEach(testCase => {
    testFileContent += `
  it("${testCase.description.replace(/"/g, '\\"')}", () => {`;

    testCase.steps.forEach((step) => {
      switch (step.command) {
        case 'visit':
          testFileContent += `
    cy.visit(\`${step.value}\`);`;
          break;
        case 'get':
          testFileContent += `
    cy.get(\`${step.selector}\`)`;
          break;
        case 'contains':
          testFileContent += `
    cy.contains(\`${step.selector}\`, \`${step.value}\`)`;
          break;
        case 'click':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.click();`;
          break;
        case 'type':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.type(\`${step.value}\`)`;
          break;
        case 'check':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.check();`;
          break;
        case 'uncheck':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.uncheck();`;
          break;
        case 'select':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.select(\`${step.value}\`);`;
          break;
        case 'should':
          if (step.value === 'have.length') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}', ${step.lengthValue});`;
          } else {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}');`;
          }
          break;
        case 'blur':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.blur();`;
          break;
        default:
          console.warn(`Unknown command: ${step.command}`);
      }
    });

    testFileContent += `
  });
`;
  });

  testFileContent += `
});
`;

  const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
  const filePath = path.join(__dirname, 'cypress', 'e2e', filename);

  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  await fs.writeFile(filePath, testFileContent);

  return filename;
}

// Function to parse Cypress test file and extract test cases
async function parseCypressTestFile(fileContent) {
  const testCases = [];

  // Extract 'it' blocks which represent test cases
  const testRegex = /it\(['"](.+?)['"]\s*,\s*\(\)\s*=>\s*\{([\s\S]+?)\}\s*\)\s*;/g;
  let testMatch;

  while ((testMatch = testRegex.exec(fileContent)) !== null) {
    const description = testMatch[1];
    const testBody = testMatch[2];
    const steps = [];

    // Visit command
    const visitMatches = testBody.matchAll(/cy\.visit\(`(.+?)`\)/g);
    for (const match of visitMatches) {
      steps.push({ command: 'visit', value: match[1] });
    }

    // Get command with chained actions
    const getWithActionMatches = testBody.matchAll(/cy\.get\(`(.+?)`\)\.(\w+)\((.*?)\)/g);
    for (const match of getWithActionMatches) {
      const selector = match[1];
      const action = match[2];
      const params = match[3];

      // Add the get step
      steps.push({ command: 'get', selector });

      // Add the chained action
      switch (action) {
        case 'type':
          steps.push({ command: 'type', value: params.replace(/[`'"]/g, '') });
          break;
        case 'click':
          steps.push({ command: 'click' });
          break;
        case 'check':
          steps.push({ command: 'check' });
          break;
        case 'uncheck':
          steps.push({ command: 'uncheck' });
          break;
        case 'should':
          const shouldParams = params.split(',').map(p => p.trim().replace(/[`'"]/g, ''));
          if (shouldParams[0] === 'have.length') {
            steps.push({ command: 'should', value: shouldParams[0], lengthValue: parseInt(shouldParams[1]) });
          } else {
            steps.push({ command: 'should', value: shouldParams[0] });
          }
          break;
        case 'blur':
          steps.push({ command: 'blur' });
          break;
      }
    }

    // Contains command
    const containsMatches = testBody.matchAll(/cy\.contains\(`(.+?)`,\s*`(.+?)`\)/g);
    for (const match of containsMatches) {
      steps.push({ command: 'contains', selector: match[1], value: match[2] });
    }

    // Get with should command (standalone)
    const getShouldMatches = testBody.matchAll(/cy\.get\(`(.+?)`\)\.should\(`(.+?)`(?:,\s*(\d+))?\)/g);
    for (const match of getShouldMatches) {
      steps.push({ command: 'get', selector: match[1] });
      if (match[3]) { // If there's a length value
        steps.push({ command: 'should', value: match[2], lengthValue: parseInt(match[3]) });
      } else {
        steps.push({ command: 'should', value: match[2] });
      }
    }

    testCases.push({ description, steps });
  }

  return testCases;
}

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
