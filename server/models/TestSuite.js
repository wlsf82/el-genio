const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('./Project');

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
