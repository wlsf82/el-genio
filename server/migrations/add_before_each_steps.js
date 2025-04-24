const { sequelize } = require('../config/database');

async function runMigration() {
  try {
    console.log('Starting migration: Adding beforeEachSteps column to TestSuite table...');

    // Add the column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE "TestSuites"
      ADD COLUMN IF NOT EXISTS "beforeEachSteps" JSONB DEFAULT '[]'::jsonb;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration when this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
