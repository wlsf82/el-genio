const path = require('path');
const fs = require('fs').promises;

// Function to generate Cypress test file with filtering capability
async function generateCypressTestFile(testSuite) {
  const { id, name, testCases, beforeEachSteps } = testSuite;

  let testFileContent = `
// Auto-generated Cypress test file
// Test Suite: ${name}

describe("${name.replace(/"/g, '\\"')}", () => {`;

  // Add beforeEach if it exists
  if (beforeEachSteps && beforeEachSteps.length > 0) {
    testFileContent += `
  beforeEach(() => {`;

    beforeEachSteps.forEach((step) => {
      switch (step.command) {
        case 'visit':
          testFileContent += `
    cy.visit(\`${step.value}\`)`;
          break;
        case 'get':
          testFileContent += `
    cy.get(\`${step.selector}\`)`;
          if (step.chainOption === 'first') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.first()`;
          } else if (step.chainOption === 'last') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.last()`;
          }
          break;
        case 'contains':
          testFileContent += `
    cy.contains(\`${step.selector}\`, \`${step.value}\`)`;
          break;
        case 'click':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.click()`;
          break;
        case 'type':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.type(\`${step.value}\`)`;
          break;
        case 'check':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.check()`;
          break;
        case 'uncheck':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.uncheck()`;
          break;
        case 'select':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.select(\`${step.value}\`)`;
          break;
        case 'should':
          if (step.value === 'have.length') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}', ${step.lengthValue})`;
          } else if (step.value === 'contain') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}', '${step.containedText}')`;
          } else {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}')`;
          }
          break;
        case 'and':
          if (step.value === 'have.length') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}', ${step.lengthValue})`;
          } else if (step.value === 'contain') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}', '${step.containedText}')`;
          } else {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}')`;
          }
          break;
        case 'blur':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.blur()`;
          break;
        default:
          console.warn(`Unknown command: ${step.command}`);
      }
    });

    testFileContent += `
  })`;
  }

  // The rest of the code for generating test cases remains the same
  testCases.forEach((testCase, index) => {
    // Existing test case generation code
    testFileContent += `
  it("${testCase.description.replace(/"/g, '\\"')}", () => {`;

    testCase.steps.forEach((step) => {
      switch (step.command) {
        case 'visit':
          testFileContent += `
    cy.visit(\`${step.value}\`)`;
          break;
        case 'get':
          testFileContent += `
    cy.get(\`${step.selector}\`)`;
          if (step.chainOption === 'first') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.first()`;
          } else if (step.chainOption === 'last') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.last()`;
          }
          break;
        case 'contains':
          testFileContent += `
    cy.contains(\`${step.selector}\`, \`${step.value}\`)`;
          break;
        case 'click':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.click()`;
          break;
        case 'type':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.type(\`${step.value}\`)`;
          break;
        case 'check':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.check()`;
          break;
        case 'uncheck':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.uncheck()`;
          break;
        case 'select':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.select(\`${step.value}\`)`;
          break;
        case 'should':
          if (step.value === 'have.length') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}', ${step.lengthValue})`;
          } else if (step.value === 'contain') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}', '${step.containedText}')`;
          } else {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.should('${step.value}')`;
          }
          break;
        case 'and':
          if (step.value === 'have.length') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}', ${step.lengthValue})`;
          } else if (step.value === 'contain') {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}', '${step.containedText}')`;
          } else {
            testFileContent = testFileContent.trimEnd();
            testFileContent += `.and('${step.value}')`;
          }
          break;
        case 'blur':
          testFileContent = testFileContent.trimEnd();
          testFileContent += `.blur()`;
          break;
        default:
          console.warn(`Unknown command: ${step.command}`);
      }
    });

    testFileContent += `
  })`;

    // Add newline between test cases, but not after the last one
    if (index < testCases.length - 1) {
      testFileContent += `\n`;
    }
  });

  testFileContent += `
})
`;

  const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_${id}.cy.js`;
  const filePath = path.join(__dirname, '..', 'cypress', 'e2e', filename);

  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  await fs.writeFile(filePath, testFileContent);

  return filename;
}

module.exports = {
  generateCypressTestFile
};
