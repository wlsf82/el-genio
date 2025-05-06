"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { FormData } from "./types";
import { TestSteps } from "./test-steps";
import { DEFAULT_TEST_CASE_STEP } from "./utils";
import { SuiteFormTestCaseSteps } from "./test-case-steps";

export function SuiteFormTestCases() {
  const { control } = useFormContext<FormData>();
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    control,
    name: "test_cases",
  });

  const addTestCase = () => {
    appendTestCase({
      description: "",
      steps: [DEFAULT_TEST_CASE_STEP],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-6">
        {testCaseFields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Test Case {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTestCase(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Controller
                  name={`test_cases.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter test case description"
                    />
                  )}
                />
              </div>

              <SuiteFormTestCaseSteps testCaseIndex={index} />
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
        <Plus className="w-4 h-4 mr-2" />
        Add Test Case
      </Button>
    </div>
  );
}
