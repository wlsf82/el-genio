const sampleTestSuiteWithManyTestCasesJSFile = require('../fixtures/sampleTestSuiteWithManyTestCases.js')

Cypress.Commands.add('createSampleProject', (project = {
  name: 'Sample Project',
  description: 'Sample project description'
}) => {
  cy.request('POST', '/api/projects', project)
})

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
    .then(response => {
        // Assert the generated test file is correct
        cy.readFile(`server/cypress/e2e/cypress_playground_${response.body.id}.cy.js`)
          .should('be.equal', sampleTestSuiteWithManyTestCasesJSFile)
      })
})

Cypress.Commands.add('createSampleTestSuiteWithSetupStepsForProject', (projectId) => {
  cy.fixture('sampleTestSuiteWithSetupSteps.json').then((testSuite) => {
    cy.request({
      method: 'POST',
      url: '/api/test-suites',
      body: {
        ...testSuite,
        projectId
      }
    });
  });
});

Cypress.Commands.add('deleteProjectByName', name => {
  cy.request('GET', '/api/projects')
    .then(response => {
      const projectToDelete = response.body.filter(project => project.name === name)
      projectToDelete.forEach(suite => {
        cy.request('DELETE', `/api/projects/${suite.id}`)
          .its('status')
          .should('eq', 204)
      })
    })
})
