"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTestSuite } from "@/services/suites";
import type { FormData } from "./types";

interface SuiteFormProps {
  children: React.ReactNode;
  projectId: string;
}

const DEFAULT_VALUES: FormData = {
  name: "",
  command_timeout: "400",
  test_cases: [
    {
      name: "",
      steps: [
        {
          command: "",
          target: "",
        },
      ],
    },
  ],
};

export const SuiteFormRoot = ({ children, projectId }: SuiteFormProps) => {
  const methods = useForm<FormData>({ defaultValues: DEFAULT_VALUES });

  const onSubmit = async (data: FormData) => {
    try {
      await createTestSuite({
        name: data.name,
        projectId,
        command_timeout: data.command_timeout
          ? parseInt(data.command_timeout)
          : undefined,
        test_cases: data.test_cases,
      });

      toast.success("Suite created successfully");
    } catch (error) {
      console.error("Error creating suite:", error);
      toast.error("Failed to create suite");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {children}
      </form>
    </FormProvider>
  );
};
