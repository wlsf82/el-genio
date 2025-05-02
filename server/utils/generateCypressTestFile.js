const path = require('path');
const fs = require('fs').promises;

// Function to generate Cypress test file with filtering capability
async function generateCypressTestFile(testSuite) {
  const { id, name, testCases, beforeEachSteps } = testSuite;

  let testFileContent = `
// Auto-generated Cypress test file
// Test Suite: ${name}

describe("${name.replace(/"/g, '\\"')}", () => {`;

  // Add beforeEach block if steps exist
  if (beforeEachSteps && beforeEachSteps.length > 0) {
    testFileContent += `\n  beforeEach(() => {`;

    // Fix: Capture the returned value from processStep
    beforeEachSteps.forEach((step) => {
      testFileContent = processStep(step, testFileContent);
    });

    testFileContent += `\n  });\n`;
  }

  testCases.forEach((testCase, index) => {
    testFileContent += `
  it("${testCase.description.replace(/"/g, '\\"')}", () => {`;

    // Fix: Also update here to be consistent
    testCase.steps.forEach((step) => {
      testFileContent = processStep(step, testFileContent);
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

// Helper function to process a step and add it to the test content
function processStep(step, testFileContent) {
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
      } else if (step.chainOption === 'second') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.eq(1)`;
      } else if (step.chainOption === 'third') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.eq(2)`;
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
      } else if (step.value === 'not.contain') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.should('not.contain', '${step.containedText}')`;
      } else if (step.value === 'be.equal') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.should('be.equal', '${step.equalText}')`;
      } else if (step.value === 'not.be.equal') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.should('not.be.equal', '${step.equalText}')`;
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
      } else if (step.value === 'not.contain') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.and('not.contain', '${step.containedText}')`;
      } else if (step.value === 'be.equal') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.and('be.equal', '${step.equalText}')`;
      } else if (step.value === 'not.be.equal') {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.and('not.be.equal', '${step.equalText}')`;
      } else {
        testFileContent = testFileContent.trimEnd();
        testFileContent += `.and('${step.value}')`;
      }
      break;
    case 'blur':
      testFileContent = testFileContent.trimEnd();
      testFileContent += `.blur()`;
      break;
    case 'title':
      testFileContent += `
    cy.title()`;
      break;
    case 'url':
      testFileContent += `
    cy.url()`;
      break;
    case 'reload':
      testFileContent += `
    cy.reload()`;
      break;
    default:
      console.warn(`Unknown command: ${step.command}`);
  }
  return testFileContent;
}

module.exports = {
  generateCypressTestFile
};
