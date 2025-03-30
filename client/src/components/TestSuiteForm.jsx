import { useState } from 'react';
import TestCaseForm from './TestCaseForm';
import axios from 'axios';
import './TestSuiteForm.css';

function TestSuiteForm({ onTestSuiteCreated }) {
  const [suiteName, setSuiteName] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTestCase = (testCase) => {
    setTestCases([...testCases, testCase]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!suiteName.trim()) {
      setError('Test suite name is required');
      return;
    }

    if (testCases.length === 0) {
      setError('At least one test case is required');
      return;
    }

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

      // Reset form
      setSuiteName('');
      setTestCases([]);

    } catch (err) {
      setError('Failed to create test suite: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-suite-form">
      <h2>Create New Test Suite</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="suiteName">Test Suite Name:</label>
          <input
            type="text"
            id="suiteName"
            value={suiteName}
            onChange={(e) => setSuiteName(e.target.value)}
            placeholder="Enter test suite name"
            required
          />
        </div>

        <h3>Test Cases</h3>
        {testCases.length > 0 ? (
          <div className="test-cases-list">
            {testCases.map((testCase, index) => (
              <div key={index} className="test-case-item">
                <h4>{testCase.description}</h4>
                <ul>
                  {testCase.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>
                      {step.command} {step.selector && `- ${step.selector}`} {step.value && `- "${step.value}"`}
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
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Test Suite'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TestSuiteForm;
