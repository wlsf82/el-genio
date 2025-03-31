import { useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react'; // Import icons
import TestSuiteForm from './components/TestSuiteForm';
import TestSuitesList from './components/TestSuitesList';
import './App.css';

function App() {
  const [testSuites, setTestSuites] = useState([]);
  const [activeView, setActiveView] = useState('list'); // 'create' or 'list'

  const handleTestSuiteCreated = (newTestSuite) => {
    setTestSuites([...testSuites, newTestSuite]);
    setActiveView('list');
  };

  return (
    <div className="app-container">
      <header>
        <h1>TestGenie 🧞‍♀️</h1>
        <nav>
          <button
            className={activeView === 'create' ? 'active' : ''}
            onClick={() => setActiveView('create')}
          >
            <PlusCircle size={16} /> Create test
          </button>
          <button
            className={activeView === 'list' ? 'active' : ''}
            onClick={() => setActiveView('list')}
          >
            <Eye size={16} /> View tests
          </button>
        </nav>
      </header>

      <main>
        {activeView === 'create' ? (
          <TestSuiteForm onTestSuiteCreated={handleTestSuiteCreated} />
        ) : (
          <TestSuitesList testSuites={testSuites} />
        )}
      </main>
    </div>
  );
}

export default App;
