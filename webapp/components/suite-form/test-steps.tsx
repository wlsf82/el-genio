'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import type { FormData } from './types'

const CYPRESS_COMMANDS = [
  { value: 'visit', hasSelector: false, hasValue: true },
  { value: 'get', hasSelector: true, hasValue: false, hasChainOptions: true },
  { value: 'contains', hasSelector: true, hasValue: true },
  { value: 'click', hasSelector: false, hasValue: false },
  { value: 'type', hasSelector: false, hasValue: true },
  { value: 'check', hasSelector: false, hasValue: false },
  { value: 'uncheck', hasSelector: false, hasValue: false },
  { value: 'select', hasSelector: false, hasValue: true },
  { value: 'blur', hasSelector: false, hasValue: false },
  { value: 'title', hasSelector: false, hasValue: false },
  { value: 'url', hasSelector: false, hasValue: false },
  { value: 'reload', hasSelector: false, hasValue: false },
  { value: 'screenshot', hasSelector: false, hasValue: true },
]

interface TestStepsProps {
  testCaseIndex: number
}

export function TestSteps({ testCaseIndex }: TestStepsProps) {
  const { control } = useFormContext<FormData>()
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: `test_cases.${testCaseIndex}.steps`,
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Steps</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendStep({
              command: '',
              selector: '',
              value: '',
              lengthValue: '',
              containedText: '',
              equalText: '',
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>
      <div className="space-y-2">
        {stepFields.map((stepField, stepIndex) => (
          <div key={stepField.id} className="flex gap-2 items-start">
            <div className="flex-1 flex gap-2">
              <Controller
                name={`test_cases.${testCaseIndex}.steps.${stepIndex}.command`}
                control={control}
                render={({ field }) => (
                  <select {...field} className="flex-1 rounded-md border border-input bg-background px-3 py-2">
                    <option value="">Select command</option>
                    {CYPRESS_COMMANDS.map(cmd => (
                      <option key={cmd.value} value={cmd.value}>
                        {cmd.value}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                name={`test_cases.${testCaseIndex}.steps.${stepIndex}.selector`}
                control={control}
                render={({ field }) => <Input {...field} placeholder="Selector" className="flex-1" />}
              />
              <Controller
                name={`test_cases.${testCaseIndex}.steps.${stepIndex}.value`}
                control={control}
                render={({ field }) => <Input {...field} placeholder="Value" className="flex-1" />}
              />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(stepIndex)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
