'use client'

import type { TestSuite } from '@/types/test-suites'
import React, { createContext, useContext } from 'react'

export interface SuiteListItemContextType {
  suite: TestSuite
}

const SuiteListItemContext = createContext<SuiteListItemContextType | null>(null)

export function useSuiteListItem() {
  const ctx = useContext(SuiteListItemContext)
  if (!ctx) throw new Error('Must be used within <SuiteList.Item>')
  return ctx
}

export function SuiteListItemRoot({
  suite,
  children,
  className = '',
}: {
  suite: TestSuite
  children: React.ReactNode
  className?: string
}) {
  return (
    <SuiteListItemContext.Provider value={{ suite }}>
      <div
        className={`flex items-center justify-between rounded-md border bg-card px-4 py-3 hover:bg-accent transition-colors group ${className}`}
      >
        {children}
      </div>
    </SuiteListItemContext.Provider>
  )
}
