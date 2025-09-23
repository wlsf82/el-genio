import { SuiteForm } from '@/components/suite-form'
import { getSuiteById } from '@/services/suites'

export default async function EditSuitePage({ params }: { params: Promise<{ projectId: string; suiteId: string }> }) {
  const { projectId, suiteId } = await params

  const suite = await getSuiteById(projectId, suiteId)

  return (
    <SuiteForm.Root
      projectId={projectId}
      suiteId={suiteId}
      defaultValues={{
        name: suite.name,
        commandTimeout: suite.commandTimeout || 4000,
        testCases: suite.testCases,
      }}
    >
      <div className="flex flex-row gap-4 justify-between items-center mb-4">
        <span className="text-2xl font-medium">Editing suite</span>
        <SuiteForm.Actions label="Update" />
      </div>
      <SuiteForm.Config />
      <SuiteForm.TestCases />
    </SuiteForm.Root>
  )
}
