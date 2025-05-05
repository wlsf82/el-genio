import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default function SuitesPage({ params }: { params: { id: string } }) {
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
