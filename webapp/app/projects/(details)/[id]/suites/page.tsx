import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuitesPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Start testing your project
        </h1>
        <p className="text-gray-600">
          Create your first test suite to ensure your project's reliability and
          maintain high quality standards.
        </p>

        <Link href={`/projects/${params.id}/suites/new`}>
          <Button>Create Test Suite</Button>
        </Link>
      </div>
    </div>
  );
}
