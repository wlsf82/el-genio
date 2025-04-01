import { useState } from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import TestSuiteForm from './components/TestSuiteForm';
import TestSuitesList from './components/TestSuitesList';
import './App.css';
import axios from 'axios';

function App() {
  const [testSuites, setTestSuites] = useState([]);
  const [activeView, setActiveView] = useState('list');
  const [editingSuite, setEditingSuite] = useState(null);
  const [forceListView, setForceListView] = useState(false);

  const handleTestSuiteCreated = async () => {
    try {
      const response = await axios.get('/api/test-suites');
      setTestSuites(response.data);
      setActiveView('list');
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
    }
  };

  const resetEditingSuite = () => {
    setEditingSuite(null);
    setForceListView(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>TestGenie 🧞‍♀️</h1>
        <nav>
          <button
            className={activeView === 'create' ? 'active' : ''}
            onClick={() => {
              resetEditingSuite();
              setActiveView('create');
            }}
          >
            <PlusCircle size={16} /> Create test
          </button>
          <button
            className={activeView === 'list' ? 'active' : ''}
            onClick={() => {
              setForceListView(true);
              setActiveView('list');
            }}
          >
            <Eye size={16} /> View tests
          </button>
        </nav>
      </header>

      <main>
        {activeView === 'create' ? (
          <TestSuiteForm onTestSuiteCreated={handleTestSuiteCreated} />
        ) : (
          <TestSuitesList
            testSuites={testSuites}
            resetEditingSuite={resetEditingSuite}
            forceListView={forceListView}
          />
        )}
      </main>
    </div>
  );
}

export default App;
