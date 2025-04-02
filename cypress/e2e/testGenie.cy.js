describe('TestGenie', () => {
  it('arrives at the test suites view', () => {
    cy.intercept('GET', '/api/test-suites').as('getTestSuites')

    cy.visit('/')
    cy.wait('@getTestSuites')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])

    cy.contains('h1', 'TestGenie 🧞‍♀️').should('be.visible')
    cy.contains('header nav button', 'Create test').should('be.visible')
    cy.contains('header nav button', 'View tests').should('be.visible')
  })
})