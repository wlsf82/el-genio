'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon, EyeIcon, PlayIcon } from 'lucide-react'
import React from 'react'

export function SuiteListActions({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-1 ml-4 ${className}`} {...props}>
      <Button size="icon" variant="ghost" aria-label="Run Test Suite">
        <PlayIcon className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Download">
        <DownloadIcon className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="View">
        <EyeIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}
