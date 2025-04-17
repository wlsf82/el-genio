import { useState } from 'react';
import { Home, Eye, PlusCircle } from 'lucide-react';
import TestSuiteForm from './components/TestSuiteForm';
import TestSuitesList from './components/TestSuitesList';
import ProjectsList from './components/ProjectsList';
import './App.css';
import axios from 'axios';

function App() {
  const [testSuites, setTestSuites] = useState([]);
  const [activeView, setActiveView] = useState('projects');
  const [editingSuite, setEditingSuite] = useState(null);
  const [forceListView, setForceListView] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleTestSuiteCreated = async () => {
    try {
      if (selectedProject) {
        const response = await axios.get(`/api/test-suites/project/${selectedProject}`);
        setTestSuites(response.data);
      }
      setActiveView('list');
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
    }
  };

  const resetEditingSuite = () => {
    setEditingSuite(null);
    setForceListView(false);
  };

  const handleSelectProject = async (projectId, action) => {
    setSelectedProject(projectId);

    if (action === 'view') {
      try {
        const response = await axios.get(`/api/test-suites/project/${projectId}`);
        setTestSuites(response.data);
        setActiveView('list');
      } catch (error) {
        console.error('Failed to fetch test suites:', error);
      }
    } else if (action === 'create') {
      setActiveView('create');
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveView('projects');
  };

  const getViewContent = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectsList onSelectProject={handleSelectProject} />;
      case 'create':
        return (
          <TestSuiteForm
            onTestSuiteCreated={handleTestSuiteCreated}
            projectId={selectedProject}
          />
        );
      case 'list':
        return (
          <TestSuitesList
            projectId={selectedProject}
            testSuites={testSuites}
            resetEditingSuite={resetEditingSuite}
            forceListView={forceListView}
          />
        );
      default:
        return <ProjectsList onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="header-left">
          <h1>El Genio 🧞‍♂️</h1>
          {selectedProject && (
            <button
              className="back-button"
              onClick={handleBackToProjects}
            >
              <Home size={16} /> Back to Projects
            </button>
          )}
        </div>
        {selectedProject && (
          <nav>
            <button
              className={activeView === 'create' ? 'active' : ''}
              onClick={() => {
                resetEditingSuite();
                setActiveView('create');
              }}
            >
              <PlusCircle size={16} /> Create Test Suite
            </button>
            <button
              className={activeView === 'list' ? 'active' : ''}
              onClick={() => {
                setForceListView(true);
                setActiveView('list');
              }}
            >
              <Eye size={16} /> View Test Suites
            </button>
          </nav>
        )}
      </header>

      <main>
        {getViewContent()}
      </main>
    </div>
  );
}

export default App;
