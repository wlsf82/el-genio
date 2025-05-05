import React from "react";
import { useSuiteListItem } from "./root";

export function SuiteListTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const { suite } = useSuiteListItem();
  return (
    <span
      className={`font-semibold text-base truncate min-w-0 hover:underline ${className}`}
      {...props}
    >
      {suite.name}
    </span>
  );
}
