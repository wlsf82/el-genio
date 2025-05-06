"use client";

import { useFormContext } from "react-hook-form";
import type { FormData } from "./root";

export function SuiteFormTestCases() {
  const { watch } = useFormContext<FormData>();
  const testCases = watch("testCases");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium">Test Cases</h3>
      <div className="text-sm text-gray-500">
        {testCases.length} test case(s) configured
      </div>
      {/* We'll expand this component later with more functionality */}
    </div>
  );
}
