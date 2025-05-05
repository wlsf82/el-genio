"use client";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { fetchTestSuites } from "@/services/suites";
import { PlayIcon, DownloadIcon, EyeIcon } from "lucide-react";
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

      <div className="flex flex-col gap-2">
        {suites.map((suite) => (
          <SuiteList.Item key={suite.id} suite={suite}>
            <Link href={`/projects/${params.id}/suites/${suite.id}`}>
              <SuiteList.Title />
            </Link>
            <SuiteList.Actions>
              <Button size="icon" variant="ghost" aria-label="Run Test Suite">
                <PlayIcon className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Download">
                <DownloadIcon className="w-4 h-4" />
              </Button>
              <Link href={`/projects/${params.id}/suites/${suite.id}`}>
                <Button size="icon" variant="ghost" aria-label="View">
                  <EyeIcon className="w-4 h-4" />
                </Button>
              </Link>
            </SuiteList.Actions>
          </SuiteList.Item>
        ))}
      </div>
    </div>
  );
}
