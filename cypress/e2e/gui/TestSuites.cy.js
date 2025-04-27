const sampleTestSuiteJSFile = require('../../fixtures/sampleTestSuite.js')
const updatedSampleTestSuiteJSFile = require('../../fixtures/updatedTestSuite.js')
const sampleTestSuiteWithSetupStepsJSFile = require('../../fixtures/sampleTestSuiteWithSetupSteps.js')
const updatedTestSuiteWithSetupStepsJSFile = require('../../fixtures/updatedTestSuiteWithSetupSteps.js')

describe('CRUD Test Suites', () => {
  beforeEach(() => {
    cy.deleteProjectByName('Sample Project')
    cy.createSampleProject()
    cy.intercept('GET', '/api/projects').as('getProjects')

    cy.window().then((win) => {
      win.localStorage.setItem('elGenioOnboardingComplete', 'true');
    });

    cy.visit('/')
    cy.wait('@getProjects')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])

    cy.title().should('be.equal', 'El Genio 🧞‍♂️')
    cy.contains('h1', 'El Genio 🧞‍♂️').should('be.visible')
    cy.contains('h2', 'Projects').should('be.visible')
    cy.contains('.project-card', 'Sample Project')
      .should('be.visible')
      .find('.view-tests-button')
      .click()
  })

  context('Without Setup Steps', () => {
    it('createa a new test suite with one test with a few steps', () => {
      // Intercept test suite creation and give it an alias
      cy.intercept('POST', '/api/test-suites').as('createTestSuite')

      // Access the create test suite form
      cy.contains('header nav button', 'Create Test Suite').click()

      // Go to the Test Cases tab
      cy.contains('.test-suite-tab', 'Test Cases').click()

      // Add test suite name
      cy.get('input[placeholder="Enter test suite name"]').type('walmyr.dev')
      // Add test case description
      cy.get('input[placeholder="Enter test case description"]').type('asserts h1 is visible')

      // Add steps and assert on their previews
      cy.get('select').select('visit')
      cy.get('input[placeholder="Value"]').type('https://walmyr.dev')
      cy.contains('button', 'Add step').click()
      cy.contains('.steps-list', 'visit "https://walmyr.dev"').should('be.visible')
      cy.get('select').select('contains')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('h1')
      cy.get('input[placeholder="Value"]').type('Walmyr')
      cy.contains('button', 'Add step').click()
      cy.contains('.steps-list', 'get element with selector "h1" which contains "Walmyr"').should('be.visible')
      cy.get('select').select('should')
      cy.contains('option', 'Select an assertion')
        .parent()
        .select('be.visible')
      cy.contains('button', 'Add step').click()
      cy.contains('.steps-list', 'asserts it should "be.visible"').should('be.visible')

      // Add test case
      cy.contains('button', 'Add test case').click()

      // Assert test case preview is displayed
      cy.contains('.test-cases-list', 'asserts h1 is visible').should('be.visible')
      cy.contains('.test-cases-list', 'visit "https://walmyr.dev"').should('be.visible')
      cy.contains('.test-cases-list', 'get element with selector "h1" which contains "Walmyr"').should('be.visible')
      cy.contains('.test-cases-list', 'asserts it should "be.visible"').should('be.visible')

      // Create test suite
      cy.contains('button', 'Create test suite').click()

      // Wait for the correct request to happen
      cy.wait('@createTestSuite')
        .then(({ response }) => {
          // Assert the generated test file is correct
          cy.readFile(`server/cypress/e2e/walmyr.dev_${response.body.id}.cy.js`)
            .should('be.equal', sampleTestSuiteJSFile)
        })

      // Assert redirect to the test suites view
      cy.contains('h2', 'Test Suites').should('be.visible')
      // Assert test suite was created
      cy.contains('.test-suite-card', 'walmyr.dev')
        .should('be.visible')
        .find('.toggle-button')
        .click()
      // Assert test case is contained inside the test suite
      cy.contains('.test-cases', 'asserts h1 is visible').should('be.visible')
    })

    it('edits a test case', () => {
      // Intercept test suite edition and give it an alias
      cy.intercept('PUT', '/api/test-suites/*').as('updateTestSuite')

      // Create a sample test suite via an API call to save time
      cy.request('GET', '/api/projects')
        .then(response => {
          const sampleProject = response.body.find(project => project.name === 'Sample Project');
          cy.createSampleTestSuiteForProject(sampleProject.id);
        });

      // Visit the app to see the newly created test suite
      cy.visit('/')
      cy.wait('@getProjects')
      cy.contains('.project-card', 'Sample Project')
        .should('be.visible')
        .find('.view-tests-button')
        .click()

      // From the test suites view, click the edit button
      cy.contains('.test-suite-card', 'walmyr.dev')
        .should('be.visible')
        .find('button.edit-button')
        .click()

      // Go to the Test Cases tab
      cy.contains('.test-suite-tab', 'Test Cases').click()

      // Go to edition mode
      cy.get('.test-case-item')
        .as('testCasePreview')
        .find('button:contains(Edit)')
        .click()

      // Remove a couple of test steps
      cy.get('.steps-section')
        .as('steps')
        .find('.step-item:contains(get element with selector "h1" which contains "Walmyr")')
        .find('.remove-step-button')
        .click()
      cy.get('.steps-section')
        .as('steps')
        .find('.step-item:contains(asserts it should "be.visible")')
        .find('.remove-step-button')
        .click()

      // Substitute the just removes steps by three new ones
      cy.get('select').select('get')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('h1')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('should')
      cy.contains('option', 'Select an assertion')
        .parent()
        .select('contain')
      cy.get('input[placeholder="Enter text to contain"]').type('Walmyr')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('and')
      cy.contains('option', 'Select an assertion')
        .parent()
        .select('be.visible')
      cy.contains('button', 'Add step').click()
      // Save test case edition
      cy.get('.test-case-form')
        .find('button:contains(Save changes)').click()

      // Assert test case preview is displayed
      cy.contains('.test-cases-list', 'asserts heading 1 is visible').should('be.visible')
      cy.contains('.test-cases-list', 'visit "https://walmyr.dev"').should('be.visible')
      cy.contains('.test-cases-list', 'get element with selector "h1"').should('be.visible')
      cy.contains('.test-cases-list', 'asserts it should "contain" text "Walmyr"').should('be.visible')
      cy.contains('.test-cases-list', 'and asserts it should "be.visible"').should('be.visible')

      // Save test suite edition
      cy.contains('button', 'Save test suite').click()

      // Wait for the correct request to happen
      cy.wait('@updateTestSuite')
        .then(request => {
          // Assert the updated test file is correct
          cy.readFile(`server/cypress/e2e/walmyr.dev_${request.response.body.id}.cy.js`)
            .should('be.equal', updatedSampleTestSuiteJSFile)
        })

      // Assert redirect to the test suites view
      cy.contains('h2', 'Test Suites').should('be.visible')
      // Assert test suite was created
      cy.contains('.test-suite-card', 'walmyr.dev')
        .should('be.visible')
        .find('.toggle-button')
        .click()
      // Assert test case is contained inside the test suite
      cy.contains('.test-cases', 'asserts heading 1 is visible').should('be.visible')
    })

    it('deletes the test suite from the test suites view', () => {
      // Intercept test suite deletion and give it an alias
      cy.intercept('DELETE', '/api/test-suites/*').as('deleteTestSuite')

      cy.request('GET', '/api/projects')
        .then(response => {
          const sampleProject = response.body.find(project => project.name === 'Sample Project');
          cy.createSampleTestSuiteForProject(sampleProject.id);
        });

      cy.visit('/')
      cy.wait('@getProjects')

      cy.contains('.project-card', 'Sample Project')
        .should('be.visible')
        .find('.view-tests-button')
        .click()

      cy.exec('ls server/cypress/e2e/')
        .its('stdout')
        .should('contain', 'walmyr.dev')

      cy.contains('.test-suite-card', 'walmyr.dev')
        .should('be.visible')
        .find('.delete-button')
        .click()

      // Wait for deletion to complete
      cy.wait('@deleteTestSuite')
        .its('response.statusCode')
        .should('be.equal', 204)
      // Assert deleted test suites does not show anymore at the list
      cy.contains('.test-suite-card', 'walmyr.dev').should('not.exist')

      cy.contains(
        '.no-test-suites',
        'No test suites created yet in this project.'
      ).should('be.visible')

      cy.exec('ls server/cypress/e2e/')
        .its('stdout')
        .should('not.contain', 'walmyr.dev')
    })

    it('deletes all test suites when deleting the project', () => {
      Cypress._.times(3, () => {
        cy.request('GET', '/api/projects')
        .then(response => {
          const sampleProject = response.body.find(project => project.name === 'Sample Project');
          cy.createSampleTestSuiteForProject(sampleProject.id);
        });
      })

      cy.visit('/')
      cy.wait('@getProjects')

      cy.exec('ls server/cypress/e2e/')
        .its('stdout')
        .should('contain', 'walmyr.dev')

      cy.contains('.project-card', 'Sample Project')
        .should('be.visible')
        .find('.delete-button')
        .click()

      cy.exec('ls server/cypress/e2e/')
        .its('stdout')
        .should('not.contain', 'walmyr.dev')
    })
  })

  context('With Setup Steps', () => {
    it('creates a test suite with setup steps', () => {
      // Intercept test suite creation and give it an alias
      cy.intercept('POST', '/api/test-suites').as('createTestSuite')

      // Access the create test suite form
      cy.contains('header nav button', 'Create Test Suite').click()

      // First add setup steps
      cy.contains('.test-suite-tab', 'Setup Steps').click()

      // Add visit step to setup
      cy.get('select').select('visit')
      cy.get('input[placeholder="Value"]').type('https://walmyr.dev')
      cy.contains('button', 'Add step').click()
      cy.contains('.step-item', 'visit "https://walmyr.dev"').should('be.visible')

      // Add login step to setup
      cy.get('select').select('get')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('#login-button')
      cy.contains('button', 'Add step').click()
      cy.contains('.step-item', 'get element with selector "#login-button"').should('be.visible')
      cy.get('select').select('click')
      cy.contains('button', 'Add step').click()
      cy.contains('.step-item', 'click').should('be.visible')

      // Save setup steps
      cy.contains('button', 'Save Setup Steps').click()

      // Go to the Test Cases tab
      cy.contains('.test-suite-tab', 'Test Cases').click()

      // Add test suite name
      cy.get('input[placeholder="Enter test suite name"]').type('walmyr.dev with setup')
      // Add test case description
      cy.get('input[placeholder="Enter test case description"]').type('asserts dashboard is visible')

      // Add test case steps
      cy.get('select').select('get')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('.dashboard')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('should')
      cy.contains('option', 'Select an assertion')
        .parent()
        .select('be.visible')
      cy.contains('button', 'Add step').click()

      // Add test case
      cy.contains('button', 'Add test case').click()

      // Create test suite
      cy.contains('button', 'Create test suite').click()

      // Wait for the correct request to happen
      cy.wait('@createTestSuite')
        .then(({ response }) => {
          // Assert the generated test file is correct
          cy.readFile(`server/cypress/e2e/walmyr.dev_with_setup_${response.body.id}.cy.js`)
            .should('be.equal', sampleTestSuiteWithSetupStepsJSFile)
        })

      // Assert redirect to the test suites view
      cy.contains('h2', 'Test Suites').should('be.visible')
      // Assert test suite was created
      cy.contains('.test-suite-card', 'walmyr.dev with setup')
        .should('be.visible')
    })

    it('edits setup steps', () => {
      // Intercept test suite edition and give it an alias
      cy.intercept('PUT', '/api/test-suites/*').as('updateTestSuite')

      // Create a sample test suite with setup steps via an API call
      cy.request('GET', '/api/projects')
        .then(response => {
          const sampleProject = response.body.find(project => project.name === 'Sample Project');
          cy.createSampleTestSuiteWithSetupStepsForProject(sampleProject.id);
        });

      // Visit the app to see the newly created test suite
      cy.visit('/')
      cy.wait('@getProjects')
      cy.contains('.project-card', 'Sample Project')
        .should('be.visible')
        .find('.view-tests-button')
        .click()

      // From the test suites view, click the edit button
      cy.contains('.test-suite-card', 'walmyr.dev with setup')
        .should('be.visible')
        .find('button.edit-button')
        .click()

      // Enter on Setup Steps edition mode
      cy.get('.setup-steps-preview')
        .find('button:contains(Edit)')
        .click()

      // Remove a setup step
      cy.get('.step-item:contains(click)')
        .find('.remove-step-button')
        .click()

      // Add new setup steps
      cy.get('select').select('get')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('#username')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('type')
      cy.get('input[placeholder="Value"]').type('admin')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('get')
      cy.get('input[placeholder="Selector (e.g., #button, .class)"]').type('#login-submit')
      cy.contains('button', 'Add step').click()
      cy.get('select').select('click')
      cy.contains('button', 'Add step').click()

      // Save setup steps
      cy.contains('button', 'Save Setup Steps').click()

      // Save test suite edition
      cy.contains('button', 'Save test suite').click()

      // Wait for the correct request to happen
      cy.wait('@updateTestSuite')
        .then(request => {
          // Assert the updated test file is correct
          cy.readFile(`server/cypress/e2e/walmyr.dev_with_setup_${request.response.body.id}.cy.js`)
            .should('be.equal', updatedTestSuiteWithSetupStepsJSFile)
        })

      // Assert redirect to the test suites view
      cy.contains('h2', 'Test Suites').should('be.visible')
    })
  })
})
