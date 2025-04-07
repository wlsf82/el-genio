const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cypress = require('cypress');
const schedule = require('node-schedule');
const { defaultCypressOptions } = require('../config/cypressConfig');

// Store scheduled jobs in memory
const scheduledJobs = {};

// Schedule test runs
const scheduleTestRun = (req, res) => {
  console.log('Scheduling Cypress tests');
  const { schedule: cronExpression } = req.body;

  if (!cronExpression) {
    return res.status(400).json({ message: 'Schedule (cron expression) is required' });
  }

  try {
    // Create a unique job ID
    const jobId = uuidv4();

    // Schedule the job using node-schedule with the cron expression
    const job = schedule.scheduleJob(cronExpression, async () => {
      try {
        console.log(`Running scheduled tests for job ID: ${jobId}`);
        const specPattern = path.join(__dirname, '..', 'cypress', 'e2e', '**', '*.cy.js');

        const cypressOptions = {
          ...defaultCypressOptions,
          spec: specPattern,
        };

        const results = await cypress.run(cypressOptions);
        console.log(`Scheduled test run completed for job ID: ${jobId}. Results: ${results.totalPassed} passed, ${results.totalFailed} failed`);
      } catch (error) {
        console.error(`Error running scheduled tests for job ID: ${jobId}`, error);
      }
    });

    // Store the job in memory
    scheduledJobs[jobId] = job;

    // Get the next run time
    const nextRunTime = job.nextInvocation().toISOString();

    res.status(201).json({
      message: 'Test run scheduled successfully',
      jobId,
      schedule: cronExpression,
      nextRunTime
    });
  } catch (error) {
    console.error('Error scheduling test run:', error);
    res.status(500).json({ message: 'Failed to schedule test run', error: error.message });
  }
};

// Cancel a scheduled job
const cancelScheduledJob = (req, res) => {
  console.log('Stopping scheduled Cypress tests');
  const { jobId } = req.params;

  const job = scheduledJobs[jobId];
  if (!job) {
    return res.status(404).json({ message: 'Scheduled job not found' });
  }

  // Cancel the job
  job.cancel();
  delete scheduledJobs[jobId];

  res.status(200).json({
    message: 'Scheduled job canceled successfully',
    nextRunTime: null,
  });
};

module.exports = {
  scheduleTestRun,
  cancelScheduledJob
};
