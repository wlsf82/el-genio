import { useState, useEffect } from 'react';
import TestCaseForm from './TestCaseForm';
import BeforeEachForm from './BeforeEachForm';
import axios from 'axios';
import './TestSuiteForm.css';

function TestSuiteForm({ onTestSuiteCreated, initialData = null, isEditing = false, projectId }) {
  const [suiteName, setSuiteName] = useState(initialData?.name || '');
  const [testCases, setTestCases] = useState(initialData?.testCases || []);
  const [beforeEachSteps, setBeforeEachSteps] = useState(initialData?.beforeEachSteps || []);
  const [commandTimeout, setCommandTimeout] = useState(initialData?.commandTimeout || '');
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [editingBeforeEach, setEditingBeforeEach] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeTab, setActiveTab] = useState('beforeEach');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    setIsFormValid(suiteName.trim() !== '' && testCases.length > 0);
  }, [suiteName, testCases]);

  const validateTestSuiteName = (name) => {
    const invalidChars = /[\/\\:*?"<>|]/g;
    const isValid = !invalidChars.test(name);

    if (!isValid) {
      setNameError('Name cannot contain any of these characters: / \\ : * ? " < > |');
      setIsFormValid(false);
    } else {
      setNameError('');
      // Only set form as valid if name is not empty and has no invalid chars
      setIsFormValid(name.trim() !== '');
    }

    return isValid;
  };

  const handleAddTestCase = (testCase) => {
    if (editingTestCase !== null) {
      setTestCases((prev) =>
        prev.map((tc, index) => (index === editingTestCase ? testCase : tc))
      );
      setEditingTestCase(null);
    } else {
      setTestCases([...testCases, testCase]);
    }
  };

  const handleEditBeforeEach = () => {
    setEditingBeforeEach(true);
    setActiveTab('beforeEach');

    setTimeout(() => {
      document.querySelector('.before-each-form').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleRemoveBeforeEach = () => {
    setBeforeEachSteps([]);
  };

  const handleAddBeforeEachSteps = (steps) => {
    setBeforeEachSteps(steps);
    setEditingBeforeEach(false);
  };

  const handleEditTestCase = (index) => {
    setEditingTestCase(index);
    setTimeout(() => {
      document.querySelector('.form-controls').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTestSuiteName(suiteName)) {
      return; // Prevent submission
    }

    setIsLoading(true);
    setError(null);

    try {
      const testSuite = {
        name: suiteName,
        testCases,
        beforeEachSteps,
        commandTimeout: commandTimeout ? parseInt(commandTimeout) : null,
        projectId
      };

      if (isEditing) {
        const response = await axios.put(`/api/test-suites/${initialData.id}`, testSuite);
        onTestSuiteCreated(response.data);
      } else {
        const response = await axios.post('/api/test-suites', testSuite);
        onTestSuiteCreated({
          id: response.data.id,
          ...testSuite
        });
      }

      setSuiteName('');
      setTestCases([]);
      setBeforeEachSteps([]);

    } catch (err) {
      setError('Failed to save test suite: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getStepDescription = (step) => {
    switch (step.command) {
      case 'visit':
        return `visit "${step.value}"`;
      case 'get':
        return `get ${step.chainOption ? `${step.chainOption}` : ''} element with selector "${step.selector}"`;
      case 'contains':
        return `get element with selector "${step.selector}" which contains "${step.value}"`;
      case 'click':
        return 'click';
      case 'check':
        return 'check';
      case 'uncheck':
        return 'uncheck';
      case 'select':
        return `select "${step.value}"`;
      case 'blur':
        return 'blur';
      case 'type':
        return `type "${step.value}"`;
      case 'should':
        if (step.value === 'have.length') {
          return `asserts it should "${step.value}" with value "${step.lengthValue}"`;
        } else if (step.value === 'contain') {
          return `asserts it should "contain" text "${step.containedText}"`;
        } else if (step.value === 'not.contain') {
          return `asserts it should "not contain" text "${step.containedText}"`;
        } else if (step.value === 'be.equal') {
          return `asserts it should "be equal" to "${step.equalText}"`;
        } else if (step.value === 'not.be.equal') {
          return `asserts it should "not be equal" to "${step.equalText}"`;
        }
        return `asserts it should "${step.value}"`;
      case 'and':
        if (step.value === 'have.length') {
          return `and asserts it should "${step.value}" with value "${step.lengthValue}"`;
        } else if (step.value === 'contain') {
          return `and asserts it should "contain" text "${step.containedText}"`;
        } else if (step.value === 'not.contain') {
          return `and asserts it should "not contain" text "${step.containedText}"`;
        } else if (step.value === 'be.equal') {
          return `and asserts it should "be equal" to "${step.equalText}"`;
        } else if (step.value === 'not.be.equal') {
          return `and asserts it should "not be equal" to "${step.equalText}"`;
        }
        return `and asserts it should "${step.value}"`;
      case 'title':
        return 'get the current title of the page';
      case 'url':
        return 'get the current URL';
      default:
        return step.command;
    }
  };

  return (
    <div className="test-suite-form">
      <h2>{isEditing ? 'Edit test suite' : 'Create test suite'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="suiteName">Test suite name:</label>
          <input
            type="text"
            id="suiteName"
            value={suiteName}
            onChange={(e) => {
              const newName = e.target.value;
              setSuiteName(newName);
              validateTestSuiteName(newName);
            }}
            placeholder="Enter test suite name"
            required
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="commandTimeout">Command Timeout (ms):</label>
          <input
            type="number"
            id="commandTimeout"
            value={commandTimeout}
            onChange={(e) => setCommandTimeout(e.target.value)}
            placeholder="Default is 4000ms"
            min="0"
          />
          <small className="help-text">Custom command timeout in milliseconds (leave empty to use the default)</small>
        </div>

        <div className="test-suite-tabs">
          <div
            className={`test-suite-tab ${activeTab === 'beforeEach' ? 'active' : ''}`}
            onClick={() => setActiveTab('beforeEach')}
          >
            Setup Steps
          </div>
          <div
            className={`test-suite-tab ${activeTab === 'testCases' ? 'active' : ''}`}
            onClick={() => setActiveTab('testCases')}
          >
            Test Cases
          </div>
        </div>

        {activeTab === 'beforeEach' && (
          <>
            {beforeEachSteps.length > 0 && (
              <div className="setup-steps-preview">
                <h3>Current Setup Steps</h3>
                <div className="test-case-item">
                  <h4>Before each test case:</h4>
                  <ul>
                    {beforeEachSteps.map((step, index) => (
                      <li key={index}>
                        {getStepDescription(step)}
                      </li>
                    ))}
                  </ul>
                  <div className="test-case-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={handleEditBeforeEach}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={handleRemoveBeforeEach}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            <BeforeEachForm
              onAddBeforeEachSteps={handleAddBeforeEachSteps}
              initialSteps={beforeEachSteps}
              isEditing={editingBeforeEach}
            />
          </>
        )}

        {activeTab === 'testCases' && (
          <>
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
                      className="edit-button"
                      onClick={() => handleEditTestCase(index)}
                    >
                      Edit
                    </button>
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

            <TestCaseForm
              onAddTestCase={handleAddTestCase}
              initialData={editingTestCase !== null ? testCases[editingTestCase] : null}
            />
          </>
        )}

        <div className="form-controls">
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid || nameError || isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save test suite' : 'Create test suite'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TestSuiteForm;
