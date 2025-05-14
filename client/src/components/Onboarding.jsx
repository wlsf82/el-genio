import { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import './Onboarding.css';

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "Welcome to El Genio 🧞‍♂️",
      content: (
        <>
          <p>El Genio is a powerful no-code testing platform that helps you create and run automated tests for your web applications without writing a single line of code.</p>
          <p>Let's explore how El Genio works and get you started with creating your first test!</p>
        </>
      )
    },
    {
      title: "Projects",
      content: (
        <>
          <p>In El Genio, everything starts with a <strong>project</strong>.</p>
          <p>A project represents the website or application you want to test. You can have multiple projects for different applications you're working on.</p>
        </>
      )
    },
    {
      title: "Test Suites",
      content: (
        <>
          <p>Each project can contain multiple <strong>test suites</strong>.</p>
          <p>A test suite is a collection of related test cases that test a specific feature or area of your application.</p>
          <p>Every test suite can have its own <strong>command timeout</strong> setting, which controls how long El Genio waits for elements before failing a test. The default timeout is <strong>4000ms</strong> (4 seconds), but you can customize this per test suite to handle slower applications.</p>
          <p>Additionally, test suites can have <strong>Setup Steps</strong> that run before each test case:</p>
          <ul>
            <li>These steps establish common preconditions for all test cases in the suite</li>
            <li>Setup Steps are defined once but executed before each test case automatically</li>
            <li>They're perfect for repetitive actions like logging in or navigating to a specific page</li>
          </ul>
        </>
      )
    },
    {
      title: "Test Cases",
      content: (
        <>
          <p>Test suites contain <strong>test cases</strong>, which are individual scenarios to verify specific functionality.</p>
          <p>Each test case consists of a series of <strong>steps</strong> that include:</p>
          <ul>
            <li><strong>Pre-conditions</strong>: Setup steps like visiting URLs</li>
            <li><strong>Actions</strong>: User interactions like clicking buttons or typing text</li>
            <li><strong>Assertions</strong>: Checking that elements exist, are visible, contain specific text, etc.</li>
          </ul>
          <div className="onboarding-css-selectors">
            <h3>🔎 CSS Selectors Basics</h3>
            <p>
              Although El Genio is a no-code testing tool, some basic knowledge of HTML and CSS selectors is required to identify elements on a web page. Here are some common techniques:
            </p>
            <ul>
              <li>
                <strong>Selection via ID</strong>
                <div className="css-selector-example">
                  <span>HTML:</span>
                  <pre>
                    {`<input id="username" />`}
                  </pre>
                  <span>Selector:</span>
                  <code>#username</code>
                </div>
              </li>
              <li>
                <strong>Selection via class</strong>
                <div className="css-selector-example">
                  <span>HTML:</span>
                  <pre>
                    {`<button class="btn-primary">Submit</button>`}
                  </pre>
                  <span>Selector:</span>
                  <code>.btn-primary</code>
                </div>
              </li>
              <li>
                <strong>Selection via HTML tag</strong>
                <div className="css-selector-example">
                  <span>HTML:</span>
                  <pre>
                    {`<button>Click me</button>`}
                  </pre>
                  <span>Selector:</span>
                  <code>button</code>
                </div>
              </li>
              <li>
                <strong>Selection via HTML tag inside another HTML tag</strong>
                <div className="css-selector-example">
                  <span>HTML:</span>
                  <pre>
                    {`<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>`}
                  </pre>
                  <span>Selector:</span>
                  <code>ul li</code>
                </div>
              </li>
              <li>
                <strong>Selection via HTML property</strong>
                <div className="css-selector-example">
                  <span>HTML:</span>
                  <pre>
                    {`<a href="http://example.com">Example</a>`}
                  </pre>
                  <span>Selector:</span>
                  <code>{`a[href="http://example.com"]`}</code>
                </div>
              </li>
            </ul>
            <p>
              For more complex selections, you may need to combine these techniques. If you need help, check the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors" target="_blank" rel="noopener noreferrer">MDN CSS selectors guide</a>.
            </p>
          </div>
        </>
      )
    },
    {
      title: "Running Tests",
      content: (
        <>
          <p>El Genio offers multiple ways to run your tests:</p>
          <ul>
            <li>Run <strong>all tests</strong> of a project from the projects list view</li>
            <li>Run <strong>all test suites</strong> from the test suites view</li>
            <li>Run a <strong>specific test suite</strong> from the test suites view</li>
            <li>Run <strong>selected test cases</strong> within a test suite (you can select which test cases to run by using the checkboxes next to each test case.)</li>
          </ul>
        </>
      )
    },
    {
      title: "Test Results",
      content: (
        <>
          <p>After running tests, El Genio provides detailed results:</p>
          <ul>
            <li>Test <strong>pass/fail</strong> status</li>
            <li>Detailed <strong>error messages</strong> for failures</li>
            <li><strong>Stack traces</strong> to help identify issues</li>
            <li>Downloadable <strong>screenshots</strong> captured at the moment of failure</li>
            <li>Downloadable <strong>videos</strong> captured at every test execution</li>
          </ul>
          <p>These results help you quickly identify and fix issues in your application.</p>
        </>
      )
    }
  ];

  const decidedAboutSettingElGenioOnboardingComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('elGenioOnboardingComplete', 'true');
    }
    onComplete();
  };

  const handleSkip = () => {
    decidedAboutSettingElGenioOnboardingComplete();
  };

  const handleComplete = () => {
    decidedAboutSettingElGenioOnboardingComplete();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <button className="close-button" onClick={handleSkip}>
          <X size={20} />
        </button>

        <div className="step-indicator">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`step ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className="onboarding-content">
          <h2>{steps[currentStep].title}</h2>
          <div className="onboarding-body">
            {steps[currentStep].content}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="dont-show-again">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <label htmlFor="dontShowAgain">Don't show again</label>
          </div>

          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button className="prev-button" onClick={prevStep}>
                <ArrowLeft size={16} /> Previous
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button className="next-button" onClick={nextStep}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button className="complete-button" onClick={handleComplete}>
                Get Started <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
