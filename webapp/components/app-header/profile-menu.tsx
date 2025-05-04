import type React from "react";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export function ProfileMenu() {
  return (
    <Button size="icon" className="h-8 w-8 rounded-full">
      <UserIcon className="h-4 w-4" />
    </Button>
  );
}
