"use client";

import { PageTitle } from "@/components/page-title";
import { SuiteForm } from "@/components/suite-form";

export default function NewSuitePage() {
  return (
    <div className="p-4 flex flex-col gap-4 w-full max-w-lg mx-auto">
      <PageTitle>Create New Suite</PageTitle>

      <SuiteForm.Root>
        <SuiteForm.Config />
        <SuiteForm.TestCases />
        <SuiteForm.Actions />
      </SuiteForm.Root>
    </div>
  );
}
