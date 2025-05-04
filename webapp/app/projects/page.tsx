"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { PageTitle } from "@/components/page-title";
import { ProjectsGrid } from "@/components/projects-grid";
import { RecentExecutions } from "@/components/recent-executions";
import Link from "next/link";
import { fetchProjects } from "@/services/projects";
import { Project } from "@/types/projects";

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

  console.log(projects);

  return (
    <div className="flex flex-col h-screen bg-accent">
      <AppHeader.Root>
        <AppHeader.Logo />
        <div className="flex-1" />
        <AppHeader.ProfileMenu />
      </AppHeader.Root>

      <div className="flex p-4 gap-12 overflow-hidden">
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
