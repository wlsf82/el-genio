import React from 'react'

export function SuiteListRoot({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col flex-1 gap-2 ${className}`}>{children}</div>
}
