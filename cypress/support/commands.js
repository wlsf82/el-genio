Cypress.Commands.add('createSampleTestSuite', () => {
  // Access the create test suite form
  cy.contains('header nav button', 'Create test').click()

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

  // Assert redirect to the test suites view
  cy.contains('h2', 'Test suites').should('be.visible')
})
