const path = require('path');
const fs = require('fs').promises;
const { TestSuite, Project } = require('../models');
const { generateCypressTestFile, parseCypressTestFile } = require('../utils');

// Get all test suites for a project
const getAllTestSuites = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const testSuites = await TestSuite.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']]
    });

    res.json(testSuites);
  } catch (error) {
    console.error('Error getting test suites:', error);
    res.status(500).json({ message: 'Failed to get test suites', error: error.message });
  }
};

// Get one test suite
const getTestSuite = async (req, res) => {
  try {
    const testSuite = await TestSuite.findByPk(req.params.id);

    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }

    res.json(testSuite);
  } catch (error) {
    console.error('Error getting test suite:', error);
    res.status(500).json({ message: 'Failed to get test suite', error: error.message });
  }
};

// Create a test suite
const createTestSuite = async (req, res) => {
  try {
    const { name, testCases, projectId } = req.body;

    if (!name || !testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: 'Invalid test suite data' });
    }

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const testSuite = await TestSuite.create({
      name,
      testCases,
      projectId
    });

    // Generate Cypress test file
    await generateCypressTestFile(testSuite);

    res.status(201).json(testSuite);
  } catch (error) {
    console.error('Error creating test suite:', error);
    res.status(500).json({ message: 'Failed to create test suite', error: error.message });
  }
};

// Update a test suite
const updateTestSuite = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, testCases } = req.body;

    if (!name || !testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: 'Invalid test suite data' });
    }

    const testSuite = await TestSuite.findByPk(id);
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }

    // Update the test suite
    testSuite.name = name;
    testSuite.testCases = testCases;
    await testSuite.save();

    // Regenerate the Cypress test file
    await generateCypressTestFile(testSuite);

    res.json(testSuite);
  } catch (error) {
    console.error('Error updating test suite:', error);
    res.status(500).json({ message: 'Failed to update test suite', error: error.message });
  }
};

// Delete a test suite
const deleteTestSuite = async (req, res) => {
  try {
    const { id } = req.params;

    const testSuite = await TestSuite.findByPk(id);
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }

    // Delete the corresponding Cypress test file
    const filename = `${testSuite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
    const filePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Could not delete file ${filePath}:`, err);
    }

    // Delete from database
    await testSuite.destroy();

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

    // Create a default project for existing test suites if it doesn't exist
    let defaultProject = await Project.findOne({ where: { name: 'Default Project' } });

    if (!defaultProject) {
      defaultProject = await Project.create({
        name: 'Default Project',
        description: 'Default project for existing test suites'
      });
    }

    for (const file of testFiles) {
      // Extract ID from filename (assumes format name_id.cy.js)
      const idMatch = file.match(/_([0-9a-f-]+)\.cy\.js$/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];

        // Check if this test suite already exists in the database
        const existingTestSuite = await TestSuite.findByPk(id);
        if (!existingTestSuite) {
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
          await TestSuite.create({
            id,
            name,
            testCases,
            projectId: defaultProject.id
          });

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
  try {
    const { id } = req.params;

    const testSuite = await TestSuite.findByPk(id);
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }

    const filename = `${testSuite.name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
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
  downloadTestFile
};
