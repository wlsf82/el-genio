import { useState, useEffect } from 'react';
import { Play, Trash, ChevronDown, ChevronUp, Edit, Plus, X, Eye } from 'lucide-react';
import './ProjectsList.css';
import ProjectForm from './ProjectForm';
import api from '../services/api'; // Replace axios with api

function ProjectsList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isRunningProject, setIsRunningProject] = useState({});
  const [isAnyProjectRunning, setIsAnyProjectRunning] = useState(false);
  const [projectResults, setProjectResults] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsCreatingProject(false);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All test suites in this project will also be deleted.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (err) {
      setError('Failed to delete project: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (project) => {
    if (editingProject) {
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === project.id ? project : p))
      );
      setEditingProject(null);
    } else {
      setProjects([project, ...projects]);
      setIsCreatingProject(false);
    }
  };

  const handleAddTestSuite = (projectId) => {
    onSelectProject(projectId, 'create');
  };

  const handleViewTestSuites = (projectId) => {
    onSelectProject(projectId, 'view');
  };

  const runProjectTests = async (projectId) => {
    setIsRunningProject({ ...isRunningProject, [projectId]: true });
    setIsAnyProjectRunning(true);
    setError(null);

    try {
      const response = await api.post(`/test-run/project/${projectId}`);
      setProjectResults({
        ...projectResults,
        [projectId]: response.data,
      });
    } catch (err) {
      setError('Failed to run tests: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsRunningProject({ ...isRunningProject, [projectId]: false });
      setIsAnyProjectRunning(false);
    }
  };

  // If we're creating or editing a project, show the form
  if (isCreatingProject || editingProject) {
    return (
      <ProjectForm
        onProjectCreated={handleProjectCreated}
        initialData={editingProject}
        isEditing={!!editingProject}
        onCancel={() => {
          setIsCreatingProject(false);
          setEditingProject(null);
        }}
      />
    );
  }

  if (isLoading && projects.length === 0) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-list">
      <div className="projects-header">
        <h2>Projects</h2>
        <button
          className="create-project-button"
          onClick={() => setIsCreatingProject(true)}
          disabled={isAnyProjectRunning}
        >
          <Plus size={16} /> Create Project
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects created yet. Create your first project to get started!</p>
        </div>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <div className="project-actions">
                <button
                  className="run-button"
                  onClick={() => runProjectTests(project.id)}
                  disabled={isAnyProjectRunning}
                >
                  <Play size={16} /> {isRunningProject[project.id] ? 'Running...' : 'Run All Tests'}
                </button>
                <button
                  className="view-tests-button"
                  onClick={() => handleViewTestSuites(project.id)}
                  disabled={isAnyProjectRunning}
                >
                  <Eye size={16} /> View Test Suites
                </button>
                <button
                  className="add-test-button"
                  onClick={() => handleAddTestSuite(project.id)}
                  disabled={isAnyProjectRunning}
                >
                  <Plus size={16} /> Add Test Suite
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEditProject(project)}
                  disabled={isAnyProjectRunning}
                >
                  <Edit size={16} /> Edit Project
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProject(project.id)}
                  disabled={isAnyProjectRunning}
                >
                  <Trash size={16} /> Delete Project
                </button>
                <button
                  className="toggle-button"
                  onClick={() => toggleProjectExpansion(project.id)}
                  disabled={isAnyProjectRunning}
                >
                  {expandedProjects[project.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {projectResults[project.id] && (
              <div className={`test-results ${projectResults[project.id].success ? 'success' : 'failure'}`}>
                <div className="results-header">
                  <h4>Test Results</h4>
                  <button
                    onClick={() => setProjectResults({ ...projectResults, [project.id]: null })}
                    className="close-results"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p>{projectResults[project.id].message}</p>
                {projectResults[project.id].details && (
                  <pre>{JSON.stringify(projectResults[project.id].details, null, 2)}</pre>
                )}
                {!projectResults[project.id].success && projectResults[project.id].failedTests && (
                  <div className="failed-tests">
                    <h5>Failed Tests:</h5>
                    <ul>
                      {projectResults[project.id].failedTests.map((test, index) => (
                        <li key={index}>
                          <strong>{test.title}</strong>
                          <pre>{test.error}</pre>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {projectResults[project.id].screenshotsLink && (
                  <div className="screenshots-link">
                    <a
                      href={projectResults[project.id].screenshotsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download screenshots
                    </a>
                  </div>
                )}
              </div>
            )}

            {expandedProjects[project.id] && (
              <div className="project-details">
                {project.description && (
                  <div className="project-description">
                    <h4>Description:</h4>
                    <p>{project.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectsList;
