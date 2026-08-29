import { RunAllTestSuitesButton } from '@/components/action-buttons/run-all-test-suite'
import { EmptyState } from '@/components/empty-state'
import { Show } from '@/components/show'
import { SuiteList } from '@/components/suite-list'
import { Button } from '@/components/ui/button'
import { fetchTestSuites } from '@/services/suites'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default async function SuitesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const suites = await fetchTestSuites(projectId)

  return (
    <Show
      when={suites.length > 0}
      fallback={
        <EmptyState
          title="Start testing your project"
          description="Create your first test suite to ensure your project's reliability and maintain high quality standards."
        >
          <Link href={`/projects/${projectId}/create-suite`}>
            <Button>Create Test Suite</Button>
          </Link>
        </EmptyState>
      }
    >
      <div className="flex flex-row gap-4 justify-between items-center mb-4">
        <span className="text-2xl font-medium">Suites</span>

        <div className="flex flex-row gap-2">
          <RunAllTestSuitesButton projectId={projectId} />
          <Link href={`/projects/${projectId}/create-suite`}>
            <Button variant="outline">
              <PlusIcon className="w-4 h-4" />
              New test suite
            </Button>
          </Link>
        </div>
      </div>

      <SuiteList.Root>
        {suites.map(suite => (
          <SuiteList.Item key={suite.id} suite={suite} projectId={projectId}>
            <SuiteList.Title />
            <SuiteList.Actions />
          </SuiteList.Item>
        ))}
      </SuiteList.Root>
    </Show>
  )
}
