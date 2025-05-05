import React from "react";
import { SuiteListItemProvider, useSuiteListItem } from "./root";
import { Input } from "@/components/ui/input";
import type { TestSuite } from "@/types/test-suites";

export function SuiteListItem({
  suite,
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { suite: TestSuite }) {
  return (
    <SuiteListItemProvider suite={suite}>
      <SuiteListItemRow className={className} {...props}>
        {children}
      </SuiteListItemRow>
    </SuiteListItemProvider>
  );
}

function SuiteListItemRow({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selected, setSelected } = useSuiteListItem();
  return (
    <div
      className={`flex items-center justify-between rounded-md border bg-card px-4 py-3 hover:bg-accent transition-colors group ${className}`}
      {...props}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Input
          type="checkbox"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
          className={`size-4 transition-opacity ${
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
        {children}
      </div>
    </div>
  );
}
