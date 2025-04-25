const projectsApiUrl = `${Cypress.env('apiUrl')}/projects`

describe('El Genio API', () => {
  context('Error scenarios', () => {
    it('returns 404 - Project not found when getting a non-existing project', () => {
      cy.getAuthToken().then(token => {
        cy.request({
          method: 'GET',
          url: `${projectsApiUrl}/0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a`,
          headers: {
            'Authorization': token
          },
          failOnStatusCode: false,
        }).as('notFoundProject')
          .its('status')
          .should('be.equal', 404)
        cy.get('@notFoundProject')
          .its('body.message')
          .should('be.equal', 'Project not found')
      })
    })

    it('returns 400 - Project name is required when trying to create a project without a name', () => {
      cy.getAuthToken().then(token => {
        cy.request({
          method: 'POST',
          url: projectsApiUrl,
          headers: {
            'Authorization': token
          },
          body: {
            description: 'Sample project description'
          },
          failOnStatusCode: false,
        }).as('projectWithoutName')
          .its('status')
          .should('be.equal', 400)
        cy.get('@projectWithoutName')
          .its('body.message')
          .should('be.equal', 'Project name is required')
      })
    })
  })
})
