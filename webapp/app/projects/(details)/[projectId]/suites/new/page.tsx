import { PageTitle } from "@/components/page-title";
import { SuiteForm } from "@/components/suite-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewSuitePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="p-4 flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <PageTitle>Create New Suite</PageTitle>

      <SuiteForm.Root projectId={projectId}>
        <Card>
          <CardHeader>
            <CardTitle>Suite Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SuiteForm.Config />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <SuiteForm.TestCases />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SuiteForm.Actions />
          </CardContent>
        </Card>
      </SuiteForm.Root>
    </div>
  );
}
