const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const { sequelize, createDbIfNotExists } = require('./config/database');

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const testRunRoutes = require('./routes/testRunRoutes');
const { downloadScreenshots } = require('./controllers/testRunController');

// Import migration
const runBeforeEachStepsMigration = async () => {
  try {
    console.log('Running migration: Adding beforeEachSteps column to TestSuite table...');
    await sequelize.query(`
      ALTER TABLE "TestSuites"
      ADD COLUMN IF NOT EXISTS "beforeEachSteps" JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

const addCommandTimeoutMigration = async () => {
  try {
    console.log('Running migration: Adding commandTimeout column to TestSuite table...');
    await sequelize.query(`
      ALTER TABLE "TestSuites"
      ADD COLUMN IF NOT EXISTS "commandTimeout" INTEGER;
    `);
    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/projects', projectRoutes);
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-run', testRunRoutes);

// Serve Cypress screenshots folder
app.use('/cypress/screenshots', express.static(path.join(__dirname, 'cypress', 'screenshots')));

// Add the screenshots download endpoint at the original path
app.get('/cypress/screenshots/download', downloadScreenshots);

// Start server
const startServer = async () => {
  try {
    // Create database if it doesn't exist
    await createDbIfNotExists();

    // Run migrations before syncing models
    const migrationSuccessful = await runBeforeEachStepsMigration();
    if (!migrationSuccessful) {
      console.warn('Warning: Migration had issues but will continue server startup');
    }

    // Sync database models
    await sequelize.sync();
    console.log('Database synchronized successfully');

    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      // Create cypress/e2e directory if it doesn't exist
      const cypressE2ePath = path.join(__dirname, 'cypress', 'e2e');
      await fs.mkdir(cypressE2ePath, { recursive: true });
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

const initApp = async () => {
  try {
    await createDbIfNotExists();
    await sequelize.authenticate();
    await sequelize.sync();
    await runBeforeEachStepsMigration();
    await addCommandTimeoutMigration(); // Add this line

    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      // Create cypress/e2e directory if it doesn't exist
      const cypressE2ePath = path.join(__dirname, 'cypress', 'e2e');
      await fs.mkdir(cypressE2ePath, { recursive: true });
    });
  } catch (error) {
    console.error('App initialization error:', error);
  }
};

initApp();
