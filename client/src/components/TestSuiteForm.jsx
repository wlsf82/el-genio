import { useState, useEffect } from 'react';
import TestCaseForm from './TestCaseForm';
import axios from 'axios';
import './TestSuiteForm.css';

function TestSuiteForm({ onTestSuiteCreated }) {
  const [suiteName, setSuiteName] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(suiteName.trim() !== '' && testCases.length > 0);
  }, [suiteName, testCases]);

  const handleAddTestCase = (testCase) => {
    setTestCases([...testCases, testCase]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const testSuite = {
        name: suiteName,
        testCases
      };

      const response = await axios.post('/api/test-suites', testSuite);

      onTestSuiteCreated({
        id: response.data.id,
        ...testSuite
      });

      setSuiteName('');
      setTestCases([]);

    } catch (err) {
      setError('Failed to create test suite: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getStepDescription = (step) => {
    switch (step.command) {
      case 'visit':
        return `visit '${step.value}'`;
      case 'get':
        return `get element with selector '${step.selector}'`;
      case 'contains':
        return `get element with selector '${step.selector}' which contains '${step.value}'`;
      case 'click':
        return 'click';
      case 'check':
        return 'check';
      case 'uncheck':
        return 'uncheck';
      case 'select':
        return `select '${step.value}'`;
      case 'blur':
        return 'blur';
      case 'type':
        return `type '${step.value}'`;
      case 'should':
        return `asserts it should '${step.value}'`;
      default:
        return step.command;
    }
  };

  return (
    <div className="test-suite-form">
      <h2>Create test suite</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="suiteName">Test suite name:</label>
          <input
            type="text"
            id="suiteName"
            value={suiteName}
            onChange={(e) => setSuiteName(e.target.value)}
            placeholder="Enter test suite name"
            required
          />
        </div>

        <h3>Test cases</h3>
        {testCases.length > 0 ? (
          <div className="test-cases-list">
            {testCases.map((testCase, index) => (
              <div key={index} className="test-case-item">
                <h4>{testCase.description}</h4>
                <ul>
                  {testCase.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>
                      {getStepDescription(step)}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveTestCase(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-test-cases">No test cases added yet.</p>
        )}

        <TestCaseForm onAddTestCase={handleAddTestCase} />

        <div className="form-controls">
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create test suite'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TestSuiteForm;
