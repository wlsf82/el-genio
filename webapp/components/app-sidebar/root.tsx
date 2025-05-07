import { cn } from '@/lib/utils'
import type React from 'react'

export function AppSidebarRoot({ children, className }: { children: React.ReactNode; className?: string }) {
  return <aside className={cn('w-64 border-r flex flex-col overflow-auto', className)}>{children}</aside>
}
