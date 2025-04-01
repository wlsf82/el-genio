import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './TestCaseForm.css';

function TestCaseForm({ onAddTestCase, initialData = null }) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [steps, setSteps] = useState(initialData?.steps || []);
  const [currentStep, setCurrentStep] = useState({
    command: '',
    selector: '',
    value: '',
    lengthValue: ''
  });
  const [editingStepIndex, setEditingStepIndex] = useState(null);

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
    'not.be.focused',
    'have.length'
  ];

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setSteps(initialData.steps);
    }
  }, [initialData]);

  const handleAddStep = () => {
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

    if (newStep.command === 'should') {
      newStep.isChained = true;
    }

    if (editingStepIndex !== null) {
      const updatedSteps = [...steps];
      updatedSteps[editingStepIndex] = newStep;
      setSteps(updatedSteps);
      setEditingStepIndex(null);
    } else {
      setSteps([...steps, newStep]);
    }

    setCurrentStep({
      command: '',
      selector: '',
      value: '',
      lengthValue: ''
    });
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleEditStep = (index) => {
    const stepToEdit = steps[index];
    setCurrentStep(stepToEdit);
    setEditingStepIndex(index);

    setTimeout(() => {
      document.querySelector('.step-form').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleCommandChange = (e) => {
    const command = e.target.value;
    setCurrentStep({
      ...currentStep,
      command
    });
  };

  const handleSubmit = () => {
    if (!description.trim() || steps.length === 0) {
      return;
    }

    onAddTestCase({
      description,
      steps
    });

    setDescription('');
    setSteps([]);
  };

  const getStepDescription = (step) => {
    switch (step.command) {
      case 'visit':
        return `visit "${step.value}"`;
      case 'get':
        return `get element with selector "${step.selector}"`;
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
        }
        return `asserts it should "${step.value}"`;
      default:
        return step.command;
    }
  };

  const selectedCommand = CYPRESS_COMMANDS.find(cmd => cmd.value === currentStep.command);

  return (
    <div className="test-case-form">
      <h3>{initialData ? 'Edit test case' : 'Add new test case'}</h3>

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
                  className="edit-step-button"
                  onClick={() => handleEditStep(index)}
                >
                  Edit
                </button>
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
              <>
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

                {currentStep.value === 'have.length' && (
                  <input
                    type="number"
                    value={currentStep.lengthValue || ''}
                    onChange={(e) => setCurrentStep({ ...currentStep, lengthValue: e.target.value })}
                    placeholder="Enter length (e.g., 3)"
                  />
                )}
              </>
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
              {editingStepIndex !== null ? 'Update step' : 'Add step'}
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="add-test-case-button"
        onClick={handleSubmit}
        disabled={!description.trim() || steps.length === 0}
      >
        {initialData ? 'Save changes' : 'Add test case'}
      </button>
    </div>
  );
}

export default TestCaseForm;
