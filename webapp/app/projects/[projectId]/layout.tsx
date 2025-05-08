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

  return (
    <div className="flex flex-col h-screen bg-accent overflow-hidden">
      <AppHeaderComposed projectId={projectId} />

      <div className="w-full flex-1 h-screen overflow-auto">
        <div className="container mx-auto flex flex-1 min-h-full">
          <div className="flex-1 flex flex-row min-h-full">
            <div className="w-56 border-r py-8">
              <AppSidebar.Root className="px-4 sticky top-8">
                <AppSidebar.MenuTitle label="General" />
                <AppSidebar.MenuItem label="Suites" href={`/projects/${projectId}`} />
                <AppSidebar.MenuItem label="Globals" href={`/projects/${projectId}/globals`} />
              </AppSidebar.Root>
            </div>
            <div className="flex-1 px-12 py-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
