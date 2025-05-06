"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { CYPRESS_COMMANDS, DEFAULT_TEST_CASE_STEP } from "./utils";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

export function SuiteFormTestCaseSteps({
  testCaseIndex,
}: {
  testCaseIndex: number;
}) {
  const { control } = useFormContext<FormData>();
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: `test_cases.${testCaseIndex}.steps`,
  });

  return (
    <div className="flex flex-col gap-4">
      {stepFields.map((stepField, stepIndex) => (
        <div key={stepField.id} className="flex gap-2 items-start">
          <Controller
            name={`test_cases.${testCaseIndex}.steps.${stepIndex}.command`}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select command" />
                </SelectTrigger>
                <SelectContent>
                  {CYPRESS_COMMANDS.map((cmd) => (
                    <SelectItem key={cmd.value} value={cmd.value}>
                      {cmd.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name={`test_cases.${testCaseIndex}.steps.${stepIndex}.target`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Selector or value"
                className="flex-1"
              />
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeStep(stepIndex)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendStep(DEFAULT_TEST_CASE_STEP)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Step
      </Button>
    </div>
  );
}
