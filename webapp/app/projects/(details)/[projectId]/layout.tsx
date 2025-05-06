import { AppHeaderComposed } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col h-screen">
      <AppHeaderComposed projectId={projectId} />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar.Root>
          <AppSidebar.MenuTitle label="General" />
          <AppSidebar.MenuItem label="Suites" active />
          <AppSidebar.MenuItem label="Globals" />
        </AppSidebar.Root>

        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
