const express = require('express');
const router = express.Router();
const testRunController = require('../controllers/testRunController');

// POST run all test suites for a project
router.post('/project/:projectId', testRunController.runProjectTestSuites);

// GET download screenshots as zip
router.get('/screenshots/download', testRunController.downloadScreenshots);

// GET download videos as zip
router.get('/videos/download', testRunController.downloadVideos);

module.exports = router;
