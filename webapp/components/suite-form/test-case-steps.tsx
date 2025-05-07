'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '../ui/label'
import { CYPRESS_COMMANDS, DEFAULT_TEST_CASE_STEP } from './utils'

export function SuiteFormTestCaseSteps({ testCaseIndex }: { testCaseIndex: number }) {
  const { control } = useFormContext()
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: `test_cases.${testCaseIndex}.steps`,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Steps</Label>

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
                    {CYPRESS_COMMANDS.map(cmd => (
                      <SelectItem key={cmd.value} value={cmd.value}>
                        {cmd.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name={`test_cases.${testCaseIndex}.steps.${stepIndex}.selector`}
              control={control}
              render={({ field }) => (
                <Input type="text" {...field} placeholder="Selector or value" className="flex-1" />
              )}
            />

            <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(stepIndex)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="ghost" size="lg" onClick={() => appendStep(DEFAULT_TEST_CASE_STEP)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Step
      </Button>
    </div>
  )
}
