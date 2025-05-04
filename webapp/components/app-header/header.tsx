import type React from "react";

export function AppHeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <header className="bg-white border-b flex items-center h-12 px-4 gap-2">
      {children}
    </header>
  );
}
