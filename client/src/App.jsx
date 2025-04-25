import { useEffect, useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import { Home, PlusCircle, Eye, LogOut } from 'lucide-react';
import './App.css';
import ProjectsList from './components/ProjectsList';
import TestSuiteForm from './components/TestSuiteForm';
import TestSuitesList from './components/TestSuitesList';
import Onboarding from './components/Onboarding';
import api from './services/api'; // Replace axios with api

function App() {
  const [user, setUser] = useState(localStorage.getItem('token') ? 'user' : null);
  const [showRegister, setShowRegister] = useState(false);
  const [testSuites, setTestSuites] = useState([]);
  const [activeView, setActiveView] = useState('projects');
  const [editingSuite, setEditingSuite] = useState(null);
  const [forceListView, setForceListView] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('elGenioOnboardingComplete') === 'true';

    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleTestSuiteCreated = async () => {
    try {
      if (selectedProject) {
        const response = await api.get(`/test-suites/project/${selectedProject}`);
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
        const response = await api.get(`/test-suites/project/${projectId}`);
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

  if (!user) {
    return showRegister
      ? (
        <>
          <Register onRegistered={() => setShowRegister(false)} />
          <div className="auth-toggle">
            <button onClick={() => setShowRegister(false)}>Already have an account? Log in</button>
          </div>
        </>
      ) : (
        <>
          <Login onLoggedIn={() => setUser('user')} />
          <div className="auth-toggle">
            <button onClick={() => setShowRegister(true)}>Don't have an account? Register</button>
          </div>
        </>
      );
  }

  // Add logout handler function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app-container">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

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

        <div className="header-right">
          {user && (
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {selectedProject && (
          <nav>
            {activeView === 'list' && (
              <button
                className={activeView === 'create' ? 'active' : ''}
                onClick={() => {
                  resetEditingSuite();
                  setActiveView('create');
                }}
              >
                <PlusCircle size={16} /> Create Test Suite
              </button>
            )}
            {activeView === 'create' && (
              <button
                className={activeView === 'list' ? 'active' : ''}
                onClick={() => {
                  setForceListView(true);
                  setActiveView('list');
                }}
              >
                <Eye size={16} /> View Test Suites
              </button>
            )}
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
