'use client'

import React from 'react'
import { useSuiteListItem } from './list-item'

export function SuiteListTitle({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { suite } = useSuiteListItem()

  return (
    <span className={`font-semibold text-base truncate min-w-0 ${className}`} {...props}>
      {suite.name}
    </span>
  )
}
