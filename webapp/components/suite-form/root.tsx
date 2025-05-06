"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { createTestSuite } from "@/services/suites";

export type FormData = {
  name: string;
  commandTimeout: string;
  testCases: Array<{
    name: string;
    steps: Array<{
      command: string;
      target: string;
    }>;
  }>;
};

interface SuiteFormProps {
  children: React.ReactNode;
}

export const SuiteFormRoot = ({ children }: SuiteFormProps) => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      commandTimeout: "400",
      testCases: [
        {
          name: "Uma description do test case",
          steps: [
            {
              command: "get",
              target: "#button",
            },
          ],
        },
      ],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createTestSuite({
        name: data.name,
        projectId,
        commandTimeout: data.commandTimeout
          ? parseInt(data.commandTimeout)
          : undefined,
        testCases: data.testCases,
      });
      toast.success("Suite created successfully");
      router.back();
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
