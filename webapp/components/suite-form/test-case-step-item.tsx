'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CYPRESS_COMMANDS } from './utils'

export function SuiteFormTestCaseStepItem({
  testCaseIndex,
  stepIndex,
  onRemoveStep,
}: {
  testCaseIndex: number
  stepIndex: number
  onRemoveStep: () => void
}) {
  const { control } = useFormContext()

  const command = useWatch({
    control,
    name: `test_cases.${testCaseIndex}.steps.${stepIndex}.command`,
  })

  return (
    <div className="flex gap-2 items-start">
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

      {CYPRESS_COMMANDS.find(cmd => cmd.value === command)?.hasSelector && (
        <Controller
          name={`test_cases.${testCaseIndex}.steps.${stepIndex}.selector`}
          control={control}
          render={({ field }) => (
            <Input type="text" {...field} placeholder="Selector (e.g., #button, .class)" className="flex-1" />
          )}
        />
      )}

      <Button type="button" variant="ghost" size="sm" onClick={onRemoveStep}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
