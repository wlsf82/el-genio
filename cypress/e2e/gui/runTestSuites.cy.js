describe('Run Test Suites', () => {
  beforeEach(() => {
    cy.deleteProjectByName('Sample Project')
    cy.createSampleProject()
    cy.intercept('GET', '/api/projects').as('getProjects')

    cy.sessionLoginSkippingOnboarding()
  })

  it('runs a just created test suite via the projects list', () => {
    cy.getAuthToken().then(token => {
      cy.request({
        method: 'GET',
        url: '/api/projects',
        headers: {
          'Authorization': token
        }
      }).then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample Project')
        cy.createSampleTestSuiteForProject(sampleProject.id)
      })
    })

    cy.visit('/')
    cy.wait('@getProjects')

    cy.contains('.project-card', 'Sample Project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample Project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
      .find('.edit-button').should('be.disabled')

    cy.contains(
      '.test-results.success',
      'All tests passed! ✅',
      { timeout: 30000 }
    ).should('be.visible')
  })

  it('runs and fails a just created test suite via the projects list', () => {
    cy.getAuthToken().then(token => {
      cy.request({
        method: 'GET',
        url: '/api/projects',
        headers: {
          'Authorization': token
        }
      }).then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample Project')
        cy.createSampleTestSuiteThatFailsForProject(sampleProject.id)
      })
    })

    cy.visit('/')
    cy.wait('@getProjects')

    cy.contains('.project-card', 'Sample Project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample Project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
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

  it('runs all tests from the test suites view', () => {
    Cypress._.times(3, () => {
      cy.getAuthToken().then(token => {
        cy.request({
          method: 'GET',
          url: '/api/projects',
          headers: {
            'Authorization': token
          }
        }).then(response => {
          const sampleProject = response.body.find(project => project.name === 'Sample Project')
          cy.createSampleTestSuiteForProject(sampleProject.id)
        })
      })
    })

    cy.visit('/')
    cy.wait('@getProjects')
    cy.contains('.project-card', 'Sample Project')
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


  it('creates and runs a test suite with lots of test cases via the projects list', () => {
    cy.getAuthToken().then(token => {
      cy.request({
        method: 'GET',
        url: '/api/projects',
        headers: {
          'Authorization': token
        }
      }).then(response => {
        const sampleProject = response.body.find(project => project.name === 'Sample Project')
        cy.createSampleTestSuiteWithManyTestCasesForProject(sampleProject.id)
      })
    })

    cy.visit('/')
    cy.wait('@getProjects')

    cy.contains('.project-card', 'Sample Project')
      .should('be.visible')
      .find('.run-button')
      .click()

    cy.contains('.project-card', 'Sample Project')
      .find('.run-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
      .find('.delete-button').should('be.disabled')
    cy.contains('.project-card', 'Sample Project')
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
})
