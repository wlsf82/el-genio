import type React from "react";

export function AppSidebarRoot({ children }: { children: React.ReactNode }) {
  return (
    <aside className="w-64 border-r flex flex-col overflow-auto">
      {children}
    </aside>
  );
}
