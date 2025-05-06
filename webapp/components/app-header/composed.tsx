import type React from "react";
import { AppHeader } from ".";

export function AppHeaderComposed({ projectId }: { projectId: string }) {
  return (
    <AppHeader.Root>
      <AppHeader.Logo />
      <div className="h-5 border-r mx-1" />
      <AppHeader.ProjectSelector projectId={projectId} />
      <div className="flex-1" />
      <AppHeader.ProfileMenu />
    </AppHeader.Root>
  );
}
