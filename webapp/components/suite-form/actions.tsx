"use client";

import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { FormData } from "./root";

export function SuiteFormActions() {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext<FormData>();

  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Suite"}
      </Button>
    </div>
  );
}
