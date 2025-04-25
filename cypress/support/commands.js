const sampleTestSuiteWithManyTestCasesJSFile = require('../fixtures/sampleTestSuiteWithManyTestCases.js')

const username = Cypress.env('ROOT_USER')
const password = Cypress.env('ROOT_PASSWORD')

// Add a command to get auth token - stores it in Cypress.env()
Cypress.Commands.add('getAuthToken', () => {
  // Skip if we already have a token
  if (Cypress.env('authToken')) {
    return cy.wrap(Cypress.env('authToken'))
  }

  return cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password }
  }).then(response => {
    Cypress.env('authToken', response.body.token)
    return cy.wrap(response.body.token)
  })
})

Cypress.Commands.add('loginFn', () => {
  cy.visit('/')
  cy.get('#username').type(username)
  cy.get('#password').type(password, { log: false })
  cy.contains('button', 'Log In').click()
  cy.contains('button', 'Logout').should('be.visible')
})

Cypress.Commands.add('sessionLoginSkippingOnboarding', () => {
  const loginFn = () => {
    cy.loginFn()
  }

  cy.session(username, loginFn)

  cy.window().then((win) => {
    win.localStorage.setItem('elGenioOnboardingComplete', 'true');
  });

  cy.visit('/')
})

Cypress.Commands.add('sessionLogin', () => {
  const loginFn = () => {
    cy.loginFn()
  }

  cy.session(username, loginFn)

  cy.visit('/')
})

Cypress.Commands.add('createSampleProject', (project = {
  name: 'Sample Project',
  description: 'Sample project description'
}) => {
  cy.getAuthToken().then(token => {
    cy.request({
      method: 'POST',
      url: '/api/projects',
      body: project,
      headers: {
        'Authorization': token
      }
    })
  })
})

Cypress.Commands.add('createSampleTestSuiteForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuite.json')}
  testSuiteData.projectId = projectId

  return cy.getAuthToken().then(token => {
    cy.request({
      method: 'POST',
      url: '/api/test-suites',
      body: testSuiteData,
      headers: {
        'Authorization': token
      }
    })
  })
})

Cypress.Commands.add('createSampleTestSuiteThatFailsForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuiteThatFails.json')}
  testSuiteData.projectId = projectId

  cy.getAuthToken().then(token => {
    cy.request({
      method: 'POST',
      url: '/api/test-suites',
      body: testSuiteData,
      headers: {
        'Authorization': token
      }
    })
  })
})

Cypress.Commands.add('createSampleTestSuiteWithManyTestCasesForProject', projectId => {
  const testSuiteData = {...require('../fixtures/sampleTestSuiteWithManyTestCases.json')}
  testSuiteData.projectId = projectId

  cy.getAuthToken().then(token => {
    cy.request({
      method: 'POST',
      url: '/api/test-suites',
      body: testSuiteData,
      headers: {
        'Authorization': token
      }
    }).then(response => {
        // Assert the generated test file is correct
        cy.readFile(`server/cypress/e2e/cypress_playground_${response.body.id}.cy.js`)
          .should('be.equal', sampleTestSuiteWithManyTestCasesJSFile)
      })
  })
})

Cypress.Commands.add('deleteProjectByName', name => {
  cy.getAuthToken().then(token => {
    cy.request({
      method: 'GET',
      url: '/api/projects',
      headers: {
        'Authorization': token
      }
    }).then(response => {
        const projectToDelete = response.body.filter(project => project.name === name)
        projectToDelete.forEach(suite => {
          cy.request({
            method: 'DELETE',
            url: `/api/projects/${suite.id}`,
            headers: {
              'Authorization': token
            }
          })
            .its('status')
            .should('eq', 204)
        })
      })
  })
})
