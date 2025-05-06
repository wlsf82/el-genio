"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProjects } from "@/services/projects";
import { Project } from "@/types/projects";

export function ProjectSelector({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [defaultValue, setDefaultValue] = React.useState<string>("");

  React.useEffect(() => {
    if (!projectId) return;

    setDefaultValue(projectId);
  }, [projectId]);

  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    loadProjects();
  }, []);

  const handleProjectChange = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <Select value={defaultValue} onValueChange={handleProjectChange}>
      <SelectTrigger className="text-xs uppercase h-auto border-none shadow-none focus-visible:ring-0 px-0">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent alignOffset={-12} position="popper">
        <SelectGroup>
          {projects.map((project) => (
            <SelectItem
              key={project.id}
              className="uppercase"
              value={project.id}
            >
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
