describe('TestGenie', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/test-suites').as('getTestSuites')

    cy.visit('/')
    cy.wait('@getTestSuites')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])
  })

  it('arrives at the test suites view', () => {
    cy.contains('h1', 'TestGenie 🧞‍♀️').should('be.visible')
    cy.contains('header nav button', 'Create test').should('be.visible')
    cy.contains('header nav button', 'View tests').should('be.visible')
  })

  it('createa a new test suite with one test with a few steps', () => {
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
    // Assert test suite was created
    cy.contains('.test-suite-card', 'walmyr.dev')
      .should('be.visible')
      .find('.toggle-button')
      .click()
    // Assert test case is contained inside the test suite
    cy.contains('.test-cases', 'asserts h1 is visible').should('be.visible')
  })

  it('runs a just created test suite', () => {
    cy.createSampleTestSuite()

    cy.contains('.test-suite-card', 'walmyr.dev')
      .should('be.visible')
      .find('button:contains(Run)')
      .click()

    cy.contains(
      '.test-results.success',
      'All tests passed! ✅',
      { timeout: 30000 }
    ).should('be.visible')
  })
})
