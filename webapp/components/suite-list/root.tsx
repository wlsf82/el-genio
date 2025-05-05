import React, { createContext, useContext, useState } from "react";
import type { TestSuite } from "@/types/test-suites";

export interface SuiteListItemContextType {
  suite: TestSuite;
  selected: boolean;
  setSelected: (v: boolean) => void;
}

const SuiteListItemContext = createContext<SuiteListItemContextType | null>(
  null
);

export function useSuiteListItem() {
  const ctx = useContext(SuiteListItemContext);
  if (!ctx) throw new Error("Must be used within <SuiteList.Item>");
  return ctx;
}

export function SuiteListItemProvider({
  suite,
  children,
}: {
  suite: TestSuite;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <SuiteListItemContext.Provider value={{ suite, selected, setSelected }}>
      {children}
    </SuiteListItemContext.Provider>
  );
}
