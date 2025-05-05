"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/page-title";
import { createTestSuite } from "@/services/suites";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type FormData = {
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

export default function NewSuitePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
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
    <div className="p-4 flex flex-col gap-4 w-full max-w-lg mx-auto">
      <PageTitle>Create New Suite</PageTitle>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Suite Name
          </label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Suite name is required",
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                className="w-full bg-white"
                placeholder="Enter suite name"
              />
            )}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="commandTimeout" className="text-sm font-medium">
            Command Timeout (ms)
          </label>
          <Controller
            name="commandTimeout"
            control={control}
            rules={{
              pattern: {
                value: /^\d*$/,
                message: "Command timeout must be a number",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="commandTimeout"
                className="w-full bg-white"
                placeholder="Enter timeout in milliseconds"
              />
            )}
          />
          <p className="text-sm text-gray-500">
            Custom command timeout in milliseconds (leave empty to use the
            default)
          </p>
          {errors.commandTimeout && (
            <p className="text-sm text-red-500">
              {errors.commandTimeout.message}
            </p>
          )}
        </div>

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
      </form>
    </div>
  );
}
