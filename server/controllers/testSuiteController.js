const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { generateCypressTestFile, parseCypressTestFile } = require('../utils');

// Store test suites in memory (in a real app, use a database)
const testSuites = {};

// Get all test suites
const getAllTestSuites = (req, res) => {
  const suites = Object.values(testSuites);
  res.json(suites);
};

// Get one test suite
const getTestSuite = (req, res) => {
  const suite = testSuites[req.params.id];
  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }
  res.json(suite);
};

// Create a test suite
const createTestSuite = async (req, res) => {
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
};

// Update a test suite
const updateTestSuite = async (req, res) => {
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
};

// Delete a test suite
const deleteTestSuite = async (req, res) => {
  const id = req.params.id;
  const suite = testSuites[id];

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    // Delete the corresponding Cypress test file
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const filePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

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
};

// Load existing test suites from Cypress files
const loadExistingTestSuites = async () => {
  try {
    const cypressE2ePath = path.join(__dirname, '..', 'cypress', 'e2e');
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
};

// Download a specific test file
const downloadTestFile = async (req, res) => {
  const id = req.params.id;
  const suite = testSuites[id];

  if (!suite) {
    return res.status(404).json({ message: 'Test suite not found' });
  }

  try {
    const filename = `${suite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const filePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

    try {
      await fs.access(filePath);
    } catch (err) {
      console.error(`Test file not found: ${filePath}`);
      return res.status(404).json({ message: 'Test file not found' });
    }

    // Set headers for the response
    res.setHeader('Content-Type', 'text/javascript');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Read the file and send it as the response
    const fileContent = await fs.readFile(filePath, 'utf8');
    res.send(fileContent);
  } catch (error) {
    console.error('Error downloading test file:', error);
    res.status(500).json({
      message: 'Failed to download test file',
      error: error.message
    });
  }
};

module.exports = {
  getAllTestSuites,
  getTestSuite,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite,
  loadExistingTestSuites,
  downloadTestFile,
  testSuites
};
