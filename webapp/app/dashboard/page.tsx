import { AppHeaderComposed } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeaderComposed />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar.Root>
          <AppSidebar.MenuTitle label="General" />
          <AppSidebar.MenuItem label="Suites" active />
          <AppSidebar.MenuItem label="Globals" />
        </AppSidebar.Root>

        <div className="flex-1 flex flex-col overflow-hidden">
          <h1>main content</h1>
        </div>
      </div>
    </div>
  );
}
