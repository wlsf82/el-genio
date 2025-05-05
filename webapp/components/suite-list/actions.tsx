import React from "react";

export function SuiteListActions({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-1 ml-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
