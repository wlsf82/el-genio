import type React from 'react'

export function AppHeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <header className="bg-white border-b flex flex-0 shrink-0 items-center px-4 gap-2 sticky top-0 z-10">
      {children}
    </header>
  )
}
