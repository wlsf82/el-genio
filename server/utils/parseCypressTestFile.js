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
  parseCypressTestFile
};
