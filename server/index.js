const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sequelize, createDbIfNotExists } = require('./config/database');
const User = require('./models/User');
const Project = require('./models/Project');

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const testRunRoutes = require('./routes/testRunRoutes');
const authRoutes = require('./routes/authRoutes');
const { downloadScreenshots } = require('./controllers/testRunController');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-run', testRunRoutes);

// Serve Cypress screenshots folder
app.use('/cypress/screenshots', express.static(path.join(__dirname, 'cypress', 'screenshots')));

// Add the screenshots download endpoint at the original path
app.get('/cypress/screenshots/download', downloadScreenshots);

// Function to perform database migrations
const performMigrations = async () => {
  try {
    // Check if userId column exists in Projects table
    let hasUserIdColumn = false;
    try {
      await sequelize.query('SELECT userId FROM "Projects" LIMIT 0');
      hasUserIdColumn = true;
    } catch (error) {
      // Column doesn't exist yet
      hasUserIdColumn = false;
    }

    // Add userId column if it doesn't exist
    if (!hasUserIdColumn) {
      console.log('Adding userId column to Projects table...');
      await sequelize.query('ALTER TABLE "Projects" ADD COLUMN "userId" UUID');
      console.log('Successfully added userId column');
    } else {
      console.log('userId column already exists');
    }
  } catch (error) {
    console.error('Error performing migrations:', error);
    throw error; // Rethrow to stop server startup if migrations fail
  }
};

const createRootUserIfNotExists = async () => {
  const username = process.env.ROOT_USER;
  const password = process.env.ROOT_PASSWORD;
  if (!username || !password) return;

  const existing = await User.findOne({ where: { username } });
  if (!existing) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    console.log('Root user created');
  } else {
    console.log('Root user already exists');
  }
};

// Start server
const startServer = async () => {
  try {
    await createDbIfNotExists();
    await sequelize.sync();
    console.log('Database synchronized successfully');

    // Run migrations before setup
    await performMigrations();

    // Setup root user and migrate projects
    await createRootUserIfNotExists();

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

startServer();
