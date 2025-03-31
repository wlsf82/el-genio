const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cypress = require('cypress');

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

    // Simplified result
    const response = {
      success: results.totalFailed === 0,
      message: results.totalFailed === 0
        ? 'All tests passed!'
        : `${results.totalFailed} test(s) failed.`,
      details: {
        totalTests: results.totalTests,
        totalPassed: results.totalPassed,
        totalFailed: results.totalFailed,
        totalPending: results.totalPending,
        totalSkipped: results.totalSkipped
      }
    };

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

// Function to generate Cypress test file with filtering capability
async function generateCypressTestFile(testSuite) {
  const { id, name, testCases } = testSuite;

  let testFileContent = `
// Auto-generated Cypress test file
// Test Suite: ${name}

describe('${name.replace(/'/g, "\\'")}', () => {
`;

  // Add test cases
  testCases.forEach(testCase => {
    testFileContent += `
  it('${testCase.description.replace(/'/g, "\\'")}', () => {`;

    // Add test steps
    testCase.steps.forEach((step, index) => {
      if (step.command === 'visit') {
        testFileContent += `
    cy.visit('${step.value.replace(/'/g, "\\'")}');`;
      } else if (step.command === 'get') {
        testFileContent += `
    cy.get('${step.selector.replace(/'/g, "\\'")}')`;
      } else if (step.command === 'contains') {
        testFileContent += `
    cy.contains('${step.selector.replace(/'/g, "\\'")}', '${step.value.replace(/'/g, "\\'")}')`;
      } else if (['click', 'type', 'check', 'uncheck', 'select'].includes(step.command)) {
        // Chain these commands to the previous command
        testFileContent = testFileContent.trimEnd();
        if (step.command === 'click') {
          testFileContent += `.click();`;
        } else if (step.command === 'type') {
          testFileContent += `.type('${step.value.replace(/'/g, "\\'")}');`;
        } else if (step.command === 'check') {
          testFileContent += `.check();`;
        } else if (step.command === 'uncheck') {
          testFileContent += `.uncheck();`;
        } else if (step.command === 'select') {
          testFileContent += `.select('${step.value.replace(/'/g, "\\'")}');`;
        }
      } else if (step.command === 'wait') {
        testFileContent += `
    cy.wait(${parseInt(step.value) || 0});`;
      } else if (step.command === 'should') {
        // Chain the 'should' assertion to the previous command
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.should('${step.value}');`;
      }
    });

    testFileContent += `
  });
`;
  });
  // Close describe block
  testFileContent += `
});
`;

  // Write file to cypress/e2e directory
  const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
  const filePath = path.join(__dirname, 'cypress', 'e2e', filename);

  // Ensure directory exists
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  // Write file
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

    // Extract steps from the test body
    // Visit command
    const visitMatches = testBody.matchAll(/cy\.visit\(['"](.+?)['"]\)/g);
    for (const match of visitMatches) {
      steps.push({ command: 'visit', value: match[1] });
    }

    // Get command
    const getMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)(?!\.)/g);
    for (const match of getMatches) {
      steps.push({ command: 'get', selector: match[1] });
    }

    // Contains command
    const containsMatches = testBody.matchAll(/cy\.contains\(['"](.+?)['"],\s*['"](.+?)['"]\)/g);
    for (const match of containsMatches) {
      steps.push({ command: 'contains', selector: match[1], value: match[2] });
    }

    // Click command
    const clickMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.click\(\)/g);
    for (const match of clickMatches) {
      steps.push({ command: 'click', selector: match[1] });
    }

    // Type command
    const typeMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.type\(['"](.+?)['"]\)/g);
    for (const match of typeMatches) {
      steps.push({ command: 'type', selector: match[1], value: match[2] });
    }

    // Check command
    const checkMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.check\(\)/g);
    for (const match of checkMatches) {
      steps.push({ command: 'check', selector: match[1] });
    }

    // Uncheck command
    const uncheckMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.uncheck\(\)/g);
    for (const match of uncheckMatches) {
      steps.push({ command: 'uncheck', selector: match[1] });
    }

    // Select command
    const selectMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.select\(['"](.+?)['"]\)/g);
    for (const match of selectMatches) {
      steps.push({ command: 'select', selector: match[1], value: match[2] });
    }

    // Wait command
    const waitMatches = testBody.matchAll(/cy\.wait\((\d+)\)/g);
    for (const match of waitMatches) {
      steps.push({ command: 'wait', value: parseInt(match[1]) });
    }

    // Should command
    const shouldMatches = testBody.matchAll(/cy\.get\(['"](.+?)['"]\)\.should\(['"](.+?)['"]\)/g);
    for (const match of shouldMatches) {
      steps.push({ command: 'should', selector: match[1], value: match[2] });
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
