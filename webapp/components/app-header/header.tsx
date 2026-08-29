import type React from 'react'

export function AppHeaderRoot({ children }: { children: React.ReactNode }) {
  return <header className="h-12 flex items-center px-4 gap-2 bg-white border-b">{children}</header>
}
