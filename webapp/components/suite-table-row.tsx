"use client";
import { useRouter } from "next/navigation";
import { TableRow, TableCell } from "@/components/ui/table";
import type { TestSuite } from "@/types/test-suites";

interface SuiteTableRowProps {
  suite: TestSuite;
  projectId: string;
}

export function SuiteTableRow({ suite, projectId }: SuiteTableRowProps) {
  const router = useRouter();
  const suiteUrl = `/projects/${projectId}/suites/${suite.id}`;

  return (
    <TableRow
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(suiteUrl)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          router.push(suiteUrl);
        }
      }}
    >
      <TableCell className="font-medium">{suite.name}</TableCell>
      <TableCell>{suite.testCases?.length ?? 0}</TableCell>
      <TableCell>
        {suite.createdAt ? new Date(suite.createdAt).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell className="text-blue-600">View</TableCell>
    </TableRow>
  );
}
