const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// POST schedule a test run
router.post('/', scheduleController.scheduleTestRun);

// DELETE cancel a scheduled job
router.delete('/:jobId', scheduleController.cancelScheduledJob);

module.exports = router;
