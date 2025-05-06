import { AppHeaderComposed } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col h-screen bg-accent">
      <AppHeaderComposed projectId={projectId} />

      <div className="stack container mx-auto">
        <div className="flex-1 flex flex-row overflow-hidden">
          <AppSidebar.Root>
            <AppSidebar.MenuTitle label="General" />
            <Link href={`/projects/${projectId}/suites`}>
              <AppSidebar.MenuItem label="Suites" active />
            </Link>
            <Link href={`/projects/${projectId}/globals`}>
              <AppSidebar.MenuItem label="Globals" />
            </Link>
          </AppSidebar.Root>

          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
