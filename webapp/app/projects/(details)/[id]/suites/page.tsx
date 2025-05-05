import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { fetchTestSuites } from "@/services/suites";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Suites</h1>
        <Link href={`/projects/${params.id}/suites/new`}>
          <Button>Create Test Suite</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {suites.map((suite) => (
          <Link
            key={suite.id}
            href={`/projects/${params.id}/suites/${suite.id}`}
            className="block"
          >
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle>{suite.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
