import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { fetchTestSuites } from "@/services/suites";
import { PageTitle } from "@/components/page-title";
import { SuiteList } from "@/components/suite-list";

export default async function SuitesPage({
  params,
}: {
  params: { id: string };
}) {
  const suites = await fetchTestSuites(params.id);

  if (suites.length === 0) {
    return (
      <EmptyState
        title="Start testing your project"
        description="Create your first test suite to ensure your project's reliability and maintain high quality standards."
      >
        <Link href={`/projects/${params.id}/suites/new`}>
          <Button>Create Test Suite</Button>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex justify-between items-center">
        <PageTitle>Test Suites</PageTitle>
        <Link href={`/projects/${params.id}/suites/new`}>
          <Button>Create Test Suite</Button>
        </Link>
      </div>

      <SuiteList.Root>
        {suites.map((suite) => (
          <SuiteList.Item key={suite.id} suite={suite}>
            <SuiteList.Title />
            <SuiteList.Actions />
          </SuiteList.Item>
        ))}
      </SuiteList.Root>
    </div>
  );
}
