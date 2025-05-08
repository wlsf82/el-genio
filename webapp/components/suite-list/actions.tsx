'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon, PencilIcon } from 'lucide-react'
import Link from 'next/link'
import { RunTestSuiteButton } from '../action-buttons/run-test-suite'
import { useSuiteListItem } from './list-item'

export function SuiteListActions({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { projectId, suite } = useSuiteListItem()

  return (
    <div className={`flex items-center gap-1 ml-4 ${className}`} {...props}>
      <Button size="icon" variant="ghost" aria-label="Download">
        <DownloadIcon className="w-4 h-4" />
      </Button>
      <Link href={`/projects/${projectId}/suites/${suite.id}`}>
        <Button size="icon" variant="ghost" aria-label="View">
          <PencilIcon className="w-4 h-4" />
        </Button>
      </Link>
      <RunTestSuiteButton projectId={projectId} />
    </div>
  )
}
