"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/page-title";

type FormData = {
  name: string;
  commandTimeout: string;
};

export default function NewSuitePage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      commandTimeout: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // TODO: Add API call to create suite
    console.log(data);
    router.back();
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
