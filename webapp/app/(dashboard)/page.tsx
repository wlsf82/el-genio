import { ProjectsGrid } from '@/components/projects-grid'
import { Button } from '@/components/ui/button'
import { fetchProjects } from '@/services/projects'
import Link from 'next/link'

export default async function ProjectsPage() {
  const projects = await fetchProjects()

  return (
    <div className="container mx-auto">
      <div className="flex flex-row gap-4 py-6 mb-6 border-b border-neutral-200 justify-between items-center">
        <h2 className="text-3xl font-medium">Projects</h2>
        <Link href="/create-project">
          <Button size="sm">Create project</Button>
        </Link>
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <ProjectsGrid.Root>
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <ProjectsGrid.Card project={project} />
            </Link>
          ))}
        </ProjectsGrid.Root>
      </div>
    </div>
  )
}
