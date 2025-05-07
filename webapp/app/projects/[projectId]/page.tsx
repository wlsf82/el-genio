import { EmptyState } from '@/components/empty-state'
import { Show } from '@/components/show'
import { SuiteList } from '@/components/suite-list'
import { Button } from '@/components/ui/button'
import { fetchTestSuites } from '@/services/suites'
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
        <Link href={`/projects/${projectId}/create-suite`}>
          <Button variant="outline">New test suite</Button>
        </Link>
      </div>

      <SuiteList.Root>
        {suites.map(suite => (
          <Link href={`/projects/${projectId}/suites/${suite.id}`} key={suite.id}>
            <SuiteList.Item suite={suite}>
              <SuiteList.Title />
              <SuiteList.Actions />
            </SuiteList.Item>
          </Link>
        ))}
      </SuiteList.Root>
    </Show>
  )
}
