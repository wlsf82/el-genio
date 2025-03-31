import { useState } from 'react';
import { X } from 'lucide-react'; // Import the close icon
import './TestCaseForm.css';

function TestCaseForm({ onAddTestCase }) {
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({
    command: '',
    selector: '',
    value: ''
  });

  const CYPRESS_COMMANDS = [
    { value: 'visit', hasSelector: false, hasValue: true },
    { value: 'get', hasSelector: true, hasValue: false },
    { value: 'contains', hasSelector: true, hasValue: true },
    { value: 'click', hasSelector: false, hasValue: false },
    { value: 'type', hasSelector: false, hasValue: true },
    { value: 'check', hasSelector: false, hasValue: false },
    { value: 'uncheck', hasSelector: false, hasValue: false },
    { value: 'select', hasSelector: false, hasValue: true },
    { value: 'blur', hasSelector: false, hasValue: false },
    { value: 'should', hasSelector: false, hasValue: true, hasShouldOptions: true },
  ];

  const SHOULD_OPTIONS = [
    'be.visible',
    'not.be.visible',
    'exist',
    'not.exist',
    'be.enabled',
    'not.be.enabled',
    'be.disabled',
    'not.be.disabled',
    'be.focused',
    'not.be.focused'
  ];

  const handleAddStep = () => {
    // Validate current step
    if (!currentStep.command) {
      return;
    }

    const selectedCommand = CYPRESS_COMMANDS.find(cmd => cmd.value === currentStep.command);

    if (selectedCommand.hasSelector && !currentStep.selector) {
      return;
    }

    if (selectedCommand.hasValue && !currentStep.value) {
      return;
    }

    const newStep = { ...currentStep };

    // Mark "should" commands as chained to previous step
    if (newStep.command === 'should') {
      newStep.isChained = true;
    }

    setSteps([...steps, newStep]);
    setCurrentStep({
      command: '',
      selector: '',
      value: ''
    });
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleCommandChange = (e) => {
    const command = e.target.value;
    setCurrentStep({
      ...currentStep,
      command
    });
  };

  const handleAddTestCase = () => {
    if (!description.trim() || steps.length === 0) {
      return;
    }

    onAddTestCase({
      description,
      steps
    });

    // Reset form
    setDescription('');
    setSteps([]);
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
      case 'type':
        return `type '${step.value}'`;
      case 'should':
        return `asserts it should '${step.value}'`;
      default:
        return step.command;
    }
  };

  const selectedCommand = CYPRESS_COMMANDS.find(cmd => cmd.value === currentStep.command);

  return (
    <div className="test-case-form">
      <h3>Add new test case</h3>

      <div className="form-group">
        <label htmlFor="description">Test description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter test case description"
        />
      </div>

      <div className="steps-section">
        <h4>Steps</h4>

        {steps.length > 0 ? (
          <ul className="steps-list">
            {steps.map((step, index) => (
              <li key={index} className="step-item">
                <span>{getStepDescription(step)}</span>
                <button
                  type="button"
                  className="remove-step-button"
                  onClick={() => handleRemoveStep(index)}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-steps">No steps added yet.</p>
        )}

        <div className="step-form">
          <div className="step-input-group">
            <select
              value={currentStep.command}
              onChange={handleCommandChange}
            >
              <option value="">Select a command</option>
              {CYPRESS_COMMANDS.map(cmd => (
                <option key={cmd.value} value={cmd.value}>
                  {cmd.value}
                </option>
              ))}
            </select>

            {selectedCommand?.hasSelector && (
              <input
                type="text"
                value={currentStep.selector}
                onChange={(e) => setCurrentStep({ ...currentStep, selector: e.target.value })}
                placeholder="Selector (e.g., #button, .class)"
              />
            )}

            {selectedCommand?.hasShouldOptions && (
              <select
                value={currentStep.value}
                onChange={(e) => setCurrentStep({ ...currentStep, value: e.target.value })}
              >
                <option value="">Select an assertion</option>
                {SHOULD_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {selectedCommand?.hasValue && !selectedCommand?.hasShouldOptions && (
              <input
                type="text"
                value={currentStep.value}
                onChange={(e) => setCurrentStep({ ...currentStep, value: e.target.value })}
                placeholder="Value"
              />
            )}

            <button
              type="button"
              className="add-step-button"
              onClick={handleAddStep}
              disabled={!currentStep.command}
            >
              Add step
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="add-test-case-button"
        onClick={handleAddTestCase}
        disabled={!description.trim() || steps.length === 0}
      >
        Add test case
      </button>
    </div>
  );
}

export default TestCaseForm;
