import { useState } from 'react';
import axios from 'axios';
import './ProjectForm.css';

function ProjectForm({ onProjectCreated, initialData = null, isEditing = false, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const response = await axios.put(`/api/projects/${initialData.id}`, {
          name,
          description
        });
        onProjectCreated(response.data);
      } else {
        const response = await axios.post('/api/projects', {
          name,
          description
        });
        onProjectCreated(response.data);
      }

      if (!isEditing) {
        // Clear form if creating new
        setName('');
        setDescription('');
      }
    } catch (err) {
      setError('Failed to save project: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-form">
      <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Description (optional):</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            rows="4"
          />
        </div>

        <div className="button-container">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
