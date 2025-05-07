'use client'

import { Input } from '@/components/ui/input'
import React from 'react'
import { useSuiteListItem } from './list-item'

export function SuiteListTitle({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { suite } = useSuiteListItem()

  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <Input type="checkbox" className={`size-4 transition-opacity opacity-0 group-hover:opacity-100`} />

      <span className={`font-semibold text-base truncate min-w-0 ${className}`} {...props}>
        {suite.name}
      </span>
    </div>
  )
}
