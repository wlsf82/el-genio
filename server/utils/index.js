const path = require('path');
const fs = require('fs').promises;

// Function to generate Cypress test file with filtering capability
async function generateCypressTestFile(testSuite) {
  const { id, name, testCases } = testSuite;

  let testFileContent = `
// Auto-generated Cypress test file
// Test Suite: ${name}

describe("${name.replace(/"/g, '\\"')}", () => {`;

  testCases.forEach((testCase, index) => {
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

// Function to parse Cypress test file and extract test cases
async function parseCypressTestFile(fileContent) {
  const testCases = [];

  // Updated regex to better handle multiline test cases
  const testRegex = /it\(['"](.+?)['"]\s*,\s*\(\)\s*=>\s*\{([\s\S]+?)\}\)\s*$/gm;
  let testMatch;

  while ((testMatch = testRegex.exec(fileContent)) !== null) {
    const description = testMatch[1];
    const testBody = testMatch[2].trim();
    const steps = [];

    // Enhanced regex to capture all Cypress commands with their parameters
    const commandRegex = /cy\.(visit|get|contains)\((?:`([^`]+)`|['"]([^'"]+)['"])(?:\s*,\s*(?:`([^`]+)`|['"]([^'"]+)['"])?)?\)(?:\.(type|click|check|uncheck|should|blur)\((?:`([^`]+)`|['"]([^'"]+)['"](?:\s*,\s*(\d+))?)?\))?/g;
    let commandMatch;

    const lines = testBody.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('cy.')) continue;

      while ((commandMatch = commandRegex.exec(trimmedLine)) !== null) {
        const [
          _,
          mainCommand,
          backTickSelector,
          quoteSelector,
          backTickValue,
          quoteValue,
          chainedCommand,
          chainedBackTickValue,
          chainedQuoteValue,
          numericValue
        ] = commandMatch;

        // Handle main command
        const selector = backTickSelector || quoteSelector;
        const value = backTickValue || quoteValue;

        if (mainCommand === 'visit') {
          steps.push({ command: 'visit', value: selector });
        } else if (mainCommand === 'get') {
          steps.push({ command: 'get', selector });

          // Handle chained commands
          if (chainedCommand) {
            const chainedValue = chainedBackTickValue || chainedQuoteValue;
            switch (chainedCommand) {
              case 'type':
                steps.push({ command: 'type', value: chainedValue });
                break;
              case 'click':
                steps.push({ command: 'click' });
                break;
              case 'check':
                steps.push({ command: 'check' });
                break;
              case 'uncheck':
                steps.push({ command: 'uncheck' });
                break;
              case 'should':
                if (chainedValue === 'have.length') {
                  steps.push({
                    command: 'should',
                    value: 'have.length',
                    lengthValue: parseInt(numericValue)
                  });
                } else {
                  steps.push({ command: 'should', value: chainedValue });
                }
                break;
              case 'blur':
                steps.push({ command: 'blur' });
                break;
            }
          }
        } else if (mainCommand === 'contains') {
          steps.push({
            command: 'contains',
            selector,
            value
          });

          // Handle chained commands for contains
          if (chainedCommand) {
            const chainedValue = chainedBackTickValue || chainedQuoteValue;
            switch (chainedCommand) {
              case 'click':
                steps.push({ command: 'click' });
                break;
              case 'should':
                steps.push({ command: 'should', value: chainedValue });
                break;
            }
          }
        }
      }

      // Handle standalone chained commands
      if (trimmedLine.includes('.blur()')) {
        steps.push({ command: 'blur' });
      }
    }

    testCases.push({ description, steps });
  }

  return testCases;
}

module.exports = {
  generateCypressTestFile,
  parseCypressTestFile,
};
