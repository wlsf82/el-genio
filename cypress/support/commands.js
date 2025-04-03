const testSuite = require('../fixtures/sampleTestSuite.json')

Cypress.Commands.add('createSampleTestSuite', () => {
  cy.request('POST', '/api/test-suites', testSuite)
})

Cypress.Commands.add('deleteTestSuitesByName', name => {
  cy.request('GET', '/api/test-suites')
    .then((response) => {
      const testSuitesToDelete = response.body.filter(suite => suite.name === name)
      testSuitesToDelete.forEach(suite => {
        cy.request('DELETE', `/api/test-suites/${suite.id}`)
      })
    })
})
