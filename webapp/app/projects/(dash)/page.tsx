"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { PageTitle } from "@/components/page-title";
import { ProjectsGrid } from "@/components/projects-grid";
import { RecentExecutions } from "@/components/recent-executions";
import Link from "next/link";
import { fetchProjects } from "@/services/projects";
import { Project } from "@/types/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);

  const fetchProjectsData = async () => {
    try {
      const response = await fetchProjects();
      setProjects(response);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  React.useEffect(() => {
    fetchProjectsData();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row gap-3 py-4">
        <Input placeholder="Search" className="w-full bg-white" />
        <Link href="/projects/new">
          <Button>Create project</Button>
        </Link>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col flex-1 gap-3 w-1/3 min-w-[320px] max-w-sm">
          <PageTitle>Recent runnings</PageTitle>
          <RecentExecutions.Root>
            <RecentExecutions.Item />
          </RecentExecutions.Root>
        </div>

        <div className="flex flex-col flex-1 gap-3">
          <PageTitle>Projects</PageTitle>
          <ProjectsGrid.Root>
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <ProjectsGrid.Card project={project} />
              </Link>
            ))}
          </ProjectsGrid.Root>
        </div>
      </div>
    </div>
  );
}
