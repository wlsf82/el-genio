const { sequelize } = require('../config/database');
const Project = require('./Project');
const TestSuite = require('./TestSuite');

const models = {
  Project,
  TestSuite,
  sequelize
};

module.exports = models;
