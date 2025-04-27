const updatedTestSuiteWithSetupStepsJSFile = `
// Auto-generated Cypress test file
// Test Suite: walmyr.dev with setup

describe("walmyr.dev with setup", () => {
  beforeEach(() => {
    cy.visit(\`https://walmyr.dev\`)
    cy.get(\`#login-button\`)
    cy.get(\`#username\`).type(\`admin\`)
    cy.get(\`#login-submit\`).click()
  });

  it("asserts dashboard is visible", () => {
    cy.get(\`.dashboard\`).should('be.visible')
  })
})
`

module.exports = updatedTestSuiteWithSetupStepsJSFile
