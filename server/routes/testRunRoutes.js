const express = require('express');
const router = express.Router();
const testRunController = require('../controllers/testRunController');

// POST run all test suites
router.post('/all', testRunController.runAllTestSuites);

// GET download screenshots as zip
router.get('/screenshots/download', testRunController.downloadScreenshots);

module.exports = router;
