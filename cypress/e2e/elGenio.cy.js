const sampleTestSuiteJSFile = require('../fixtures/sampleTestSuite.js')
const updatedSampleTestSuiteJSFile = require('../fixtures/updatedTestSuite.js')
const sampleTestSuiteWithManyTestCasesJSFile = require('../fixtures/sampleTestSuiteWithManyTestCases.js')

describe('El Genio', () => {
  beforeEach(() => {
    cy.deleteProjectByName('Sample project')
    cy.intercept('GET', '/api/projects').as('getProjects')

    cy.visit('/')
    cy.wait('@getProjects')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])

    cy.title().should('be.equal', 'El Genio 🧞‍♂️')
    cy.contains('h1', 'El Genio 🧞‍♂️').should('be.visible')
    cy.contains('h2', 'Projects').should('be.visible')
    cy.contains('button', 'Create Project')
      .should('be.visible')
      .click()
    cy.get('input[placeholder="Enter project name"]').type('Sample project')
    cy.get('textarea[placeholder="Enter project description"]').type('Sample project description')
    cy.contains('button', 'Create Project').click()
    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.view-tests-button')
      .click()
  })

  it('createa a new test suite with one test with a few steps', () => {
    // Intercept test suite creation and give it an alias
    cy.intercept('POST', '/api/test-suites').as('createTestSuite')

    // Access the create test suite form
    cy.contains('header nav button', 'Create Test Suite').click()

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
      .then(request => {
        // Assert the generated test file is correct
        cy.readFile(`server/cypress/e2e/walmyr.dev_${request.response.body.id}.cy.js`)
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

  it('runs a just created test suite', () => {
    cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteForProject(sampleProject.id);
      });

    cy.visit('/')

    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.edit-button').should('be.disabled')

    cy.contains(
      '.test-results.success',
      'All tests passed! ✅',
      { timeout: 30000 }
    ).should('be.visible')
  })

  it('edits a test case', () => {
    // Intercept test suite edition and give it an alias
    cy.intercept('PUT', '/api/test-suites/*').as('updateTestSuite')

    // Create a sample test suite via an API call to save time
    cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteForProject(sampleProject.id);
      });

    // Visit the app to see the newly created test suite
    cy.visit('/')
    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.view-tests-button')
      .click()

    // From the test suites view, click the edit button
    cy.contains('.test-suite-card', 'walmyr.dev')
      .should('be.visible')
      .find('button.edit-button')
      .click()

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

  it('deletes a test suite', () => {
    // Intercept test suite deletion and give it an alias
    cy.intercept('DELETE', '/api/test-suites/*').as('deleteTestSuite')

    // Create a sample test suite via an API call to save time
    cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteForProject(sampleProject.id);
      });

    // Visit the app to see the newly created test suite
    cy.visit('/')
    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.view-tests-button')
      .click()

    // From the test suites view, click the edit button
    cy.contains('.test-suite-card', 'walmyr.dev')
      .should('be.visible')
      .find('button.delete-button')
      .click()

    // Wait for deletion to complete
    cy.wait('@deleteTestSuite')
      .its('response.statusCode')
      .should('be.equal', 204)
    // Assert deleted test suites does not show anymore at the list
    cy.contains('.test-suite-card', 'walmyr.dev').should('not.exist')
  })

  it('runs and fails a just created test suite', () => {
    cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteThatFailsForProject(sampleProject.id)
      });

    cy.visit('/')

    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.edit-button').should('be.disabled')

    cy.contains(
      '.test-results.failure',
      '1 test(s) failed. ❌',
      { timeout: 30000 }
    ).should('be.visible')
    cy.get('.test-results.failure')
      .find('h5:contains(Failed Tests:)')
      .should('be.visible')
    cy.get('.test-results.failure')
      .find('li:contains(walmyr.dev > asserts heading 1 is visible)')
      .should('be.visible')
    cy.get('.test-results.failure')
      .find('pre:contains(AssertionError: Timed out retrying after 4000ms: expected)')
      .should('be.visible')
    cy.get('.test-results.failure')
      .find('a:contains(Download screenshots)')
      .should('be.visible')
      .and('have.attr', 'href', 'http://localhost:3003/cypress/screenshots/download')
  })

  it('creates and runs a test suite with lots of test cases', () => {
    cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteWithManyTestCasesForProject(sampleProject.id)
      });

    cy.visit('/')

    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample project')
      .find('.edit-button').should('be.disabled')

    cy.contains(
      '.test-results.success',
      'All tests passed! ✅',
      { timeout: 30000 }
    ).should('be.visible')
    cy.contains(
      '.test-results.success',
      '"totalPassed": 10,'
    ).should('be.visible')
  })

  it('runs all tests', () => {
    Cypress._.times(3, () => {
      cy.request('GET', '/api/projects')
      .then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample project');
        cy.createSampleTestSuiteForProject(sampleProject.id);
      });
    })

    cy.visit('/')
    cy.contains('.project-card', 'Sample project')
      .should('be.visible')
      .find('.view-tests-button')
      .click()

    cy.contains('button', 'Run All Tests').click()

    cy.contains(
      '.test-results.success',
      'All tests passed! ✅',
      { timeout: 60000 }
    ).should('be.visible')
  })
})
