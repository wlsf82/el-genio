"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData } from "./types";

export function SuiteFormConfig() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Suite Name</Label>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Suite name is required",
          }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Input
                {...field}
                id="name"
                className={`w-full bg-white ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Enter suite name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="command_timeout">Command Timeout (ms)</Label>
        <Controller
          name="command_timeout"
          control={control}
          rules={{
            pattern: {
              value: /^\d*$/,
              message: "Command timeout must be a number",
            },
          }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Input
                {...field}
                id="command_timeout"
                className={`w-full bg-white ${
                  errors.command_timeout ? "border-red-500" : ""
                }`}
                placeholder="Enter timeout in milliseconds"
              />
              {errors.command_timeout && (
                <p className="text-sm text-red-500">
                  {errors.command_timeout.message}
                </p>
              )}
            </div>
          )}
        />
        <p className="text-sm text-gray-500">
          Custom command timeout in milliseconds (leave empty to use the
          default)
        </p>
      </div>
    </div>
  );
}
