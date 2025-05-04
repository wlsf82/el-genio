import type React from "react";
import { Lightbulb } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Lightbulb className="h-5 w-5" />
      <div className="px-2 py-1 text-xs flex items-center">EL GENIO</div>
    </div>
  );
}
