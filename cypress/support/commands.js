Cypress.Commands.add('createSampleTestSuiteForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuite.json')}
  testSuiteData.projectId = projectId

  return cy.request('POST', '/api/test-suites', testSuiteData)
})

Cypress.Commands.add('createSampleTestSuiteThatFailsForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuiteThatFails.json')}
  testSuiteData.projectId = projectId

  cy.request('POST', '/api/test-suites', testSuiteData)
})

Cypress.Commands.add('createSampleTestSuiteWithManyTestCasesForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuiteWithManyTestCases.json')}
  testSuiteData.projectId = projectId

  cy.request('POST', '/api/test-suites', testSuiteData)
})

Cypress.Commands.add('deleteProjectByName', name => {
  cy.request('GET', '/api/projects')
    .then(response => {
      const projectToDelete = response.body.filter(project => project.name === name)
      projectToDelete.forEach(suite => {
        cy.request('DELETE', `/api/projects/${suite.id}`)
      })
    })
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
