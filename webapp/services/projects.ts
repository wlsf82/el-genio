import { Project } from "@/types/projects";

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch("http://localhost:3003/api/projects");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:3003/api/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const updateProject = async (
  projectId: string,
  data: { name: string; description?: string }
): Promise<Project> => {
  try {
    const response = await fetch(
      `http://localhost:3003/api/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const createProject = async (data: {
  name: string;
  description?: string;
}): Promise<Project> => {
  try {
    const response = await fetch("http://localhost:3003/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
