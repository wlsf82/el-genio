const sampleTestSuiteWithSetupStepsJSFile = `
// Auto-generated Cypress test file
// Test Suite: walmyr.dev with setup

describe("walmyr.dev with setup", () => {
  beforeEach(() => {
    cy.visit(\`https://walmyr.dev\`)
    cy.get(\`#login-button\`).click()
  });

  it("asserts dashboard is visible", () => {
    cy.get(\`.dashboard\`).should('be.visible')
  })
})
`

module.exports = sampleTestSuiteWithSetupStepsJSFile
