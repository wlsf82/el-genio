import { useState, useEffect } from 'react';
import axios from 'axios';
import './TestSuitesList.css';
import { Play, Trash, X, ChevronDown, ChevronUp, Edit, Download } from 'lucide-react';
import TestSuiteForm from './TestSuiteForm';

function TestSuitesList({ testSuites: propTestSuites, resetEditingSuite, forceListView, projectId }) {
  const [testSuites, setTestSuites] = useState(propTestSuites || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runningTests, setRunningTests] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isAnyTestRunning, setIsAnyTestRunning] = useState(false);
  const [expandedSuites, setExpandedSuites] = useState({});
  const [editingSuite, setEditingSuite] = useState(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [allTestsResults, setAllTestsResults] = useState(null);
  const [selectedTests, setSelectedTests] = useState({});

  useEffect(() => {
    if (propTestSuites?.length > 0) {
      setTestSuites(propTestSuites);
    } else if (projectId) {
      fetchTestSuites();
    }
  }, [propTestSuites, projectId]);

  useEffect(() => {
    if (forceListView) {
      setEditingSuite(null);
    }
  }, [forceListView]);

  const toggleSuiteExpansion = (suiteId) => {
    setExpandedSuites((prev) => ({
      ...prev,
      [suiteId]: !prev[suiteId],
    }));
  };

  const fetchTestSuites = async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/test-suites/project/${projectId}`);
      setTestSuites(response.data);
    } catch (err) {
      setError('Failed to fetch test suites: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTestSelection = (suiteId, testDescription) => {
    setSelectedTests((prev) => {
      const suiteTests = prev[suiteId] || [];
      const newSuiteTests = suiteTests.includes(testDescription)
        ? suiteTests.filter((desc) => desc !== testDescription)
        : [...suiteTests, testDescription];

      return {
        ...prev,
        [suiteId]: newSuiteTests,
      };
    });
  };

  const runTest = async (testSuiteId) => {
    setRunningTests({ ...runningTests, [testSuiteId]: true });
    setIsAnyTestRunning(true);
    setError(null);

    try {
      const selectedTestTitles = selectedTests[testSuiteId] || [];
      const response = await axios.post(`/api/test-suites/${testSuiteId}/run`, {
        grepTags: selectedTestTitles,
      });
      setTestResults({
        ...testResults,
        [testSuiteId]: response.data,
      });
    } catch (err) {
      setError('Failed to run test: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunningTests({ ...runningTests, [testSuiteId]: false });
      setIsAnyTestRunning(false);
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
      setTestSuites(testSuites.filter((suite) => suite.id !== testSuiteId));
    } catch (err) {
      setError('Failed to delete test suite: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSuite = (suite) => {
    setEditingSuite(suite);
    resetEditingSuite();
  };

  const runAllTests = async () => {
    if (!projectId) return;

    setIsRunningAll(true);
    setIsAnyTestRunning(true);
    setError(null);
    setAllTestsResults(null);

    try {
      const response = await axios.post(`/api/test-run/project/${projectId}`);
      setAllTestsResults(response.data);
    } catch (err) {
      setError('Failed to run all tests: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsRunningAll(false);
      setIsAnyTestRunning(false);
    }
  };

  const downloadTestFile = (suiteId) => {
    // Create a link to download the file and click it
    const downloadUrl = `/api/test-suites/${suiteId}/download`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = true;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (editingSuite) {
    return (
      <TestSuiteForm
        initialData={editingSuite}
        onTestSuiteCreated={(updatedSuite) => {
          setTestSuites((prevSuites) =>
            prevSuites.map((suite) => (suite.id === updatedSuite.id ? updatedSuite : suite))
          );
          setEditingSuite(null);
        }}
        isEditing={true}
        projectId={projectId}
      />
    );
  }

  if (isLoading && testSuites.length === 0) {
    return <div className="loading">Loading test suites...</div>;
  }

  if (error && testSuites.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  if (testSuites.length === 0) {
    return <div className="no-test-suites">No test suites created yet in this project.</div>;
  }

  return (
    <div className="test-suites-container">
      <div className="test-suites-header">
        <h2>Test Suites</h2>
        <button
          className="run-all-button"
          onClick={runAllTests}
          disabled={isAnyTestRunning || testSuites.length === 0}
        >
          <Play size={16} /> {isRunningAll ? 'Running all tests...' : 'Run All Tests'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {allTestsResults && (
        <div className={`test-results ${allTestsResults.success ? 'success' : 'failure'}`}>
          <div className="results-header">
            <h4>All Tests Results</h4>
            <button onClick={() => setAllTestsResults(null)} className="close-results">
              <X size={16} />
            </button>
          </div>
          <p>{allTestsResults.message}</p>
          {allTestsResults.details && (
            <pre>{JSON.stringify(allTestsResults.details, null, 2)}</pre>
          )}
          {!allTestsResults.success && allTestsResults.failedTests && (
            <div className="failed-tests">
              <h4>Failed Tests:</h4>
              <ul>
                {allTestsResults.failedTests.map((test, index) => (
                  <li key={index}>
                    <strong>{test.title}</strong>
                    <pre>{test.error}</pre>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {allTestsResults.screenshotsLink && (
            <div className="screenshots-link">
              <a
                href={allTestsResults.screenshotsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download screenshots
              </a>
            </div>
          )}
        </div>
      )}

      <div className="test-suites-list">
        {testSuites.map((suite) => (
          <div key={suite.id} className="test-suite-card">
            <div className="test-suite-header">
              <h3>{suite.name}</h3>
              <div className="test-suite-actions">
                <button
                  className="run-button"
                  onClick={() => runTest(suite.id)}
                  disabled={runningTests[suite.id] || isAnyTestRunning}
                >
                  <Play size={16} /> {runningTests[suite.id] ? 'Running...' : 'Run Tests'}
                </button>
                <button
                  className="download-button"
                  onClick={() => downloadTestFile(suite.id)}
                >
                  <Download size={16} />
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEditSuite(suite)}
                  disabled={isRunningAll || runningTests[suite.id]}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTestSuite(suite.id)}
                  disabled={isRunningAll || runningTests[suite.id]}
                >
                  <Trash size={16} />
                </button>
                <button
                  className="toggle-button"
                  onClick={() => toggleSuiteExpansion(suite.id)}
                >
                  {expandedSuites[suite.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {testResults[suite.id] && (
              <div className={`test-results ${testResults[suite.id].success ? 'success' : 'failure'}`}>
                <div className="results-header">
                  <h4>Test Results</h4>
                  <button
                    onClick={() => setTestResults({ ...testResults, [suite.id]: null })}
                    className="close-results"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p>{testResults[suite.id].message}</p>
                {testResults[suite.id].details && (
                  <pre>{JSON.stringify(testResults[suite.id].details, null, 2)}</pre>
                )}
                {!testResults[suite.id].success && testResults[suite.id].failedTests && (
                  <div className="failed-tests">
                    <h4>Failed Tests:</h4>
                    <ul>
                      {testResults[suite.id].failedTests.map((test, index) => (
                        <li key={index}>
                          <strong>{test.title}</strong>
                          <pre>{test.error}</pre>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {testResults[suite.id].screenshotsLink && (
                  <div className="screenshots-link">
                    <a
                      href={testResults[suite.id].screenshotsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download screenshots
                    </a>
                  </div>
                )}
              </div>
            )}

            {expandedSuites[suite.id] && (
              <div className="test-suite-details">
                <h4>Test Cases:</h4>
                <ul className="test-cases">
                  {suite.testCases.map((testCase, testIndex) => (
                    <li key={testIndex} className="test-case">
                      <label className="test-selector">
                        <span className="test-description">{testCase.description}</span>
                        <input
                          type="checkbox"
                          checked={
                            selectedTests[suite.id]?.includes(testCase.description) || false
                          }
                          onChange={() => toggleTestSelection(suite.id, testCase.description)}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestSuitesList;
