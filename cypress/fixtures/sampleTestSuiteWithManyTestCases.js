const sampleTestSuiteWithManyTestCases = `
// Auto-generated Cypress test file
// Test Suite: Cypress Playground

describe("Cypress Playground", () => {
  it("ensures there are five animals", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`ul li\`).should('have.length', 5)
  })

  it("shows signature preview when signing it", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`#signature-textarea\`).type(\`Mary\`)
    cy.contains(\`#signature\`, \`Mary\`).should('be.visible')
  })

  it("subscribes to the newsletter", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.contains(\`button\`, \`Subscribe\`).click()
    cy.contains(\`.success\`, \`You've been successfully subscribed to our newsletter.\`).should('be.visible')
  })

  it("shows signature preview when signing and marking to show it", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`#signature-textarea-with-checkbox\`).type(\`Lary\`)
    cy.get(\`#signature-checkbox\`).check()
    cy.contains(\`#signature-triggered-by-check\`, \`Lary\`).should('be.visible')
  })

  it("turns the switch off then back on", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.contains(\`#on-off\`, \`ON\`).should('be.visible')
    cy.get(\`#off\`).check()
    cy.contains(\`#on-off\`, \`OFF\`).should('be.visible')
    cy.get(\`#on\`).check()
    cy.contains(\`#on-off\`, \`ON\`).should('be.visible')
  })

  it("sets a date (e.g., 2025/04/01)", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`input[type="date"]\`).type(\`2025-04-01\`).blur()
    cy.contains(\`p\`, \`The date you've selected is: 2025-04-01\`).should('be.visible')
  })

  it("shows an error message when submitting a wrong code", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`#code\`).type(\`0123456789\`)
    cy.contains(\`button\`, \`Submit\`).click()
    cy.contains(\`.error\`, \`The provided code isn't correct. Please, try again.\`).should('be.visible')
  })

  it("shows a promotinal banner for the Cypress, from Zero to the Cloud course", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.contains(\`#promotional-banner a\`, \`Cypress, from Zero to the Cloud\`).should('be.visible')
  })

  it("ensures the first animal is a camel and the last one is a dog", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`ul li\`).first().should('contain', 'Camel')
    cy.get(\`ul li\`).last().should('contain', 'Dog')
  })

  it("timestamp", () => {
    cy.visit(\`https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html\`)
    cy.get(\`#timestamp\`).should('be.visible')
  })
})
`

module.exports = sampleTestSuiteWithManyTestCases
