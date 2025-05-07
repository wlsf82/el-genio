import { AppHeaderComposed } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { getProjectById } from '@/services/projects'

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}>) {
  const { projectId } = await params
  const project = await getProjectById(projectId)

  return (
    <div className="flex flex-col h-screen bg-accent overflow-auto">
      <AppHeaderComposed projectId={projectId} />

      <div className="w-full flex-1 overflow-auto">
        <div className="flex flex-row gap-4 py-6 mb-6 border-b border-neutral-200 justify-between items-center">
          <div className="container mx-auto">
            <h2 className="text-4xl font-medium">{project.name}</h2>
          </div>
        </div>

        <div className="container mx-auto overflow-hidden">
          <div className="flex-1 flex flex-row">
            <AppSidebar.Root className="px-4">
              <AppSidebar.MenuTitle label="General" />
              <AppSidebar.MenuItem label="Suites" href={`/projects/${projectId}`} />
              <AppSidebar.MenuItem label="Globals" href={`/projects/${projectId}/globals`} />
            </AppSidebar.Root>

            <div className="px-12 flex-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
