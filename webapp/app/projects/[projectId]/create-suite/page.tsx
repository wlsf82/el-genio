import { SuiteForm } from '@/components/suite-form'

export default async function CreateSuitePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  return (
    <SuiteForm.Root projectId={projectId}>
      <SuiteForm.Config />
      <SuiteForm.TestCases />
      <SuiteForm.Actions className="mt-10" />
    </SuiteForm.Root>
  )
}
