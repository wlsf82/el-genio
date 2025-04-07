const express = require('express');
const router = express.Router();
const testSuiteController = require('../controllers/testSuiteController');
const testRunController = require('../controllers/testRunController');

// GET all test suites
router.get('/', testSuiteController.getAllTestSuites);

// GET single test suite by ID
router.get('/:id', testSuiteController.getTestSuite);

// POST create new test suite
router.post('/', testSuiteController.createTestSuite);

// PUT update test suite
router.put('/:id', testSuiteController.updateTestSuite);

// DELETE test suite
router.delete('/:id', testSuiteController.deleteTestSuite);

// POST run a specific test suite
router.post('/:id/run', testRunController.runTestSuite);

module.exports = router;
