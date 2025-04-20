const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('./Project');
const path = require('path');
const fs = require('fs').promises;

const TestSuite = sequelize.define('TestSuite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  testCases: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeDestroy: async (testSuite) => {
      try {
        const filename = `${testSuite.name.toLowerCase().replace(/\s+/g, '_')}_${testSuite.id}.cy.js`;
        const filePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

        await fs.access(filePath).then(async () => {
          await fs.unlink(filePath);
          console.log(`Deleted test file: ${filePath}`);
        }).catch(err => {
          console.warn(`File not found when deleting: ${filePath}`, err.message);
        });
      } catch (error) {
        console.error('Error deleting test file:', error);
        // We don't throw the error to allow the record deletion to proceed
      }
    }
  }
});

// Define the relationship between Project and TestSuite
TestSuite.belongsTo(Project, {
  foreignKey: {
    name: 'projectId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Project.hasMany(TestSuite, {
  foreignKey: 'projectId'
});

module.exports = TestSuite;
