describe('CRUD Project', () => {
  beforeEach(() => {
    cy.deleteProjectByName('TAT sample project')

    cy.intercept('GET', '/api/projects').as('getProjects')

    cy.window().then((win) => {
      win.localStorage.setItem('elGenioOnboardingComplete', 'true');
    });

    cy.visit('/')
    cy.wait('@getProjects')
  })

  it('CRUDs a project', () => {
    cy.contains('button', 'Create Project')
      .should('be.visible')
      .click()

    cy.get('input[placeholder="Enter project name"]').type('TAT sample project')
    cy.get('textarea[placeholder="Enter project description"]').type('Talking About Testing sample project.')
    cy.contains('button', 'Create Project').click()

    cy.contains('.project-card', 'TAT sample project').should('be.visible')

    cy.contains('button', 'Edit Project').click()

    cy.get('textarea[placeholder="Enter project description"]')
      .clear()
      .type('Update sample project description')

    cy.contains('button', 'Save Project').click()

    cy.contains('.project-card', 'TAT sample project')
      .as('editedProject')
      .find('.toggle-button')
      .click()

    cy.get('@editedProject')
      .should('contain', 'Update sample project description')
      .and('be.visible')

    cy.contains('button', 'Delete Project').click()

    cy.contains('.project-card', 'TAT sample project')
      .should('not.exist')
  })
})
