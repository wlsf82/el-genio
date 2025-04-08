const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

// Import routes
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const testRunRoutes = require('./routes/testRunRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const { downloadScreenshots } = require('./controllers/testRunController');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-run', testRunRoutes);
app.use('/api/schedule', scheduleRoutes);

// Serve Cypress screenshots folder
app.use('/cypress/screenshots', express.static(path.join(__dirname, 'cypress', 'screenshots')));

// Add the screenshots download endpoint at the original path
app.get('/cypress/screenshots/download', downloadScreenshots);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Create cypress/e2e directory if it doesn't exist
  const cypressE2ePath = path.join(__dirname, 'cypress', 'e2e');
  await fs.mkdir(cypressE2ePath, { recursive: true });

  // Load existing test suites from disk
  const { loadExistingTestSuites } = require('./controllers/testSuiteController');
  await loadExistingTestSuites();
});
