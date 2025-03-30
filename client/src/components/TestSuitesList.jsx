import { useState, useEffect } from 'react';
import axios from 'axios';
import './TestSuitesList.css';

function TestSuitesList({ testSuites: propTestSuites }) {
  const [testSuites, setTestSuites] = useState(propTestSuites || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runningTests, setRunningTests] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    if (propTestSuites?.length > 0) {
      setTestSuites(propTestSuites);
    } else {
      fetchTestSuites();
    }
  }, [propTestSuites]);

  const fetchTestSuites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/test-suites');
      setTestSuites(response.data);
    } catch (err) {
      setError('Failed to fetch test suites: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const runTest = async (testSuiteId) => {
    setRunningTests({ ...runningTests, [testSuiteId]: true });
    setError(null);

    try {
      const response = await axios.post(`/api/test-suites/${testSuiteId}/run`, {});
      setTestResults({
        ...testResults,
        [testSuiteId]: response.data
      });
    } catch (err) {
      setError('Failed to run test: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunningTests({ ...runningTests, [testSuiteId]: false });
    }
  };

  const deleteTestSuite = async (testSuiteId) => {
    if (!window.confirm('Are you sure you want to delete this test suite?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/test-suites/${testSuiteId}`);
      setTestSuites(testSuites.filter(suite => suite.id !== testSuiteId));
    } catch (err) {
      setError('Failed to delete test suite: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && testSuites.length === 0) {
    return <div className="loading">Loading test suites...</div>;
  }

  if (error && testSuites.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  if (testSuites.length === 0) {
    return <div className="no-test-suites">No test suites created yet.</div>;
  }

  return (
    <div className="test-suites-list">
      <h2>Your Test Suites</h2>

      {error && <div className="error-message">{error}</div>}

      {testSuites.map(suite => (
        <div key={suite.id} className="test-suite-card">
          <div className="test-suite-header">
            <h3>{suite.name}</h3>
            <div className="test-suite-actions">
              <button
                className="run-button"
                onClick={() => runTest(suite.id)}
                disabled={runningTests[suite.id]}
              >
                {runningTests[suite.id] ? 'Running...' : 'Run All Tests'}
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTestSuite(suite.id)}
              >
                Delete
              </button>
            </div>
          </div>

          {testResults[suite.id] && (
            <div className={`test-results ${testResults[suite.id].success ? 'success' : 'failure'}`}>
              <div className="test-results-header">
                <h4>Test Results</h4>
                <button
                  className="close-button"
                  onClick={() => setTestResults(prevResults => {
                    const newResults = { ...prevResults };
                    delete newResults[suite.id]; // Remove the results for this suite
                    return newResults;
                  })}
                >
                  X
                </button>
              </div>
              <p>{testResults[suite.id].message}</p>
              {testResults[suite.id].details && (
                <pre>{JSON.stringify(testResults[suite.id].details, null, 2)}</pre>
              )}
            </div>
          )}

          <div className="test-cases">
            <h4>Test Cases:</h4>
            <ul>
              {suite.testCases.map((testCase, index) => (
                <li key={index} className="test-case">
                  <div className="test-case-header">
                    <h5>{testCase.description}</h5>
                  </div>

                  <ul className="steps">
                    {testCase.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>
                        cy.{step.command}
                        {step.selector && `(${step.selector})`}
                        {step.value && step.command !== 'visit' ? `.${step.value}` : step.value ? `('${step.value}')` : ''}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TestSuitesList;
