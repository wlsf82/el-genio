import { SuiteForm } from '@/components/suite-form'

export default async function CreateSuitePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  return (
    <SuiteForm.Root projectId={projectId}>
      <div className="flex flex-row gap-4 justify-between items-center mb-4">
        <span className="text-2xl font-medium">Creating new suite</span>
        <SuiteForm.Actions />
      </div>
      <SuiteForm.Config />
      <SuiteForm.TestCases />
    </SuiteForm.Root>
  )
}
