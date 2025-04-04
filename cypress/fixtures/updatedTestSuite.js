const sampleUpdatedTestSuite = `
// Auto-generated Cypress test file
// Test Suite: walmyr.dev

describe("walmyr.dev", () => {
  it("asserts heading 1 is visible", () => {
    cy.visit(\`https://walmyr.dev\`)
    cy.get(\`h1\`).should('contain', 'Walmyr').and('be.visible')
  })
})
`

module.exports = sampleUpdatedTestSuite
