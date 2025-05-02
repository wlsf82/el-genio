import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import './BeforeEachForm.css';

function BeforeEachForm({ onAddBeforeEachSteps, initialSteps = [], isEditing = false }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({
    command: '',
    selector: '',
    value: '',
    lengthValue: '',
    containedText: ''
  });
  const [editingStepIndex, setEditingStepIndex] = useState(null);

  // Important: Update steps whenever initialSteps changes or edit mode is activated
  useEffect(() => {
    if (isEditing) {
      setSteps(initialSteps);
    }
  }, [initialSteps, isEditing]);

  const CYPRESS_COMMANDS = [
    { value: 'visit', hasSelector: false, hasValue: true },
    { value: 'get', hasSelector: true, hasValue: false, hasChainOptions: true },
    { value: 'contains', hasSelector: true, hasValue: true },
    { value: 'click', hasSelector: false, hasValue: false },
    { value: 'type', hasSelector: false, hasValue: true },
    { value: 'check', hasSelector: false, hasValue: false },
    { value: 'uncheck', hasSelector: false, hasValue: false },
    { value: 'select', hasSelector: false, hasValue: true },
    { value: 'blur', hasSelector: false, hasValue: false },
    { value: 'title', hasSelector: false, hasValue: false },
    { value: 'url', hasSelector: false, hasValue: false },
    { value: 'reload', hasSelector: false, hasValue: false },
    { value: 'should', hasSelector: false, hasValue: true, hasShouldOptions: true },
    { value: 'and', hasSelector: false, hasValue: true, hasShouldOptions: true },
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
    'have.length',
    'be.checked',
    'not.be.checked',
    'contain',
    'not.contain',
    'be.equal',
    'not.be.equal'
  ];

  const CHAIN_OPTIONS = ['first', 'last'];

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

    if (newStep.value === 'be.equal' || newStep.value === 'not.be.equal') {
      newStep.equalText = currentStep.equalText;
    }

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
      lengthValue: '',
      containedText: '',
      equalText: ''
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

  const handleSave = () => {
    // This is the critical function that updates the parent component
    onAddBeforeEachSteps(steps);

    // Always clear the form after saving, just like TestCaseForm
    setSteps([]);
    setCurrentStep({
      command: '',
      selector: '',
      value: '',
      lengthValue: '',
      containedText: ''
    });
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
      case 'title':
        return 'get the current title of the page';
      case 'url':
        return 'get the current URL';
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
      case 'reload':
        return 'reload the page';
      default:
        return step.command;
    }
  };

  const selectedCommand = CYPRESS_COMMANDS.find(cmd => cmd.value === currentStep.command);

  return (
    <div className="before-each-form">
      <h3>{isEditing ? 'Edit Setup Steps' : 'Add Setup Steps'}</h3>
      <p>
        These steps will run before each test case.
      </p>

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
          <p className="no-steps">No setup steps added yet. Setup steps are optional.</p>
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

                {(currentStep.value === 'contain' || currentStep.value === 'not.contain') && (
                  <input
                    type="text"
                    value={currentStep.containedText || ''}
                    onChange={(e) => setCurrentStep({ ...currentStep, containedText: e.target.value })}
                    placeholder={
                      currentStep.value === 'not.contain'
                        ? 'Enter text not to contain'
                        : 'Enter text to contain'
                    }
                  />
                )}

                {(currentStep.value === 'be.equal' || currentStep.value === 'not.be.equal') && (
                  <input
                    type="text"
                    value={currentStep.equalText || ''}
                    onChange={(e) => setCurrentStep({ ...currentStep, equalText: e.target.value })}
                    placeholder={
                      currentStep.value === 'not.be.equal'
                        ? 'Enter text not to be equal'
                        : 'Enter text to be equal'
                    }
                  />
                )}
              </>
            )}

            {selectedCommand?.hasChainOptions && (
              <select
                value={currentStep.chainOption || ''}
                onChange={(e) => setCurrentStep({ ...currentStep, chainOption: e.target.value })}
              >
                <option value="">No chain</option>
                {CHAIN_OPTIONS.map(option => (
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
              {editingStepIndex !== null ? 'Update step' : 'Add step'}
            </button>
          </div>
        </div>
      </div>

      <div className="save-actions">
        <button
          type="button"
          className="save-before-each-button"
          onClick={handleSave}
          disabled={steps.length === 0}
        >
          Save Setup Steps
        </button>
      </div>
    </div>
  );
}

export default BeforeEachForm;
