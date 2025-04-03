const sampleTestSuite = `
// Auto-generated Cypress test file
// Test Suite: walmyr.dev

describe("walmyr.dev", () => {
  it("asserts h1 is visible", () => {
    cy.visit(\`https://walmyr.dev\`)
    cy.contains(\`h1\`, \`Walmyr\`).should('be.visible')
  })
})
`

module.exports = sampleTestSuite
