'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CHAIN_OPTIONS, CYPRESS_COMMANDS, SHOULD_OPTIONS } from './utils'

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
    name: `testCases.${testCaseIndex}.steps.${stepIndex}.command`,
  })

  const selectedCommand = CYPRESS_COMMANDS.find(cmd => cmd.value === command)

  return (
    <div className="flex gap-2 items-start">
      <Controller
        name={`testCases.${testCaseIndex}.steps.${stepIndex}.command`}
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

      {selectedCommand?.hasSelector && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.selector`}
          control={control}
          render={({ field }) => (
            <Input type="text" {...field} placeholder="Selector (e.g., #button, .class)" className="flex-1" />
          )}
        />
      )}

      {selectedCommand?.hasValue && !selectedCommand?.hasShouldOptions && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.value`}
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              {...field}
              placeholder={selectedCommand.value === 'screenshot' ? 'Screenshot filename' : 'Value'}
              className="flex-1"
            />
          )}
        />
      )}

      {selectedCommand?.hasChainOptions && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.chainOption`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select chain option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No chain</SelectItem>
                {CHAIN_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}

      {selectedCommand?.hasShouldOptions && <ShouldOptions testCaseIndex={testCaseIndex} stepIndex={stepIndex} />}

      <Button type="button" variant="ghost" size="sm" onClick={onRemoveStep}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

const ShouldOptions = ({ testCaseIndex, stepIndex }: { testCaseIndex: number; stepIndex: number }) => {
  const { control } = useFormContext()
  const value = useWatch({
    control,
    name: `testCases.${testCaseIndex}.steps.${stepIndex}.value`,
  })

  return (
    <>
      <Controller
        name={`testCases.${testCaseIndex}.steps.${stepIndex}.value`}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an assertion" />
            </SelectTrigger>
            <SelectContent>
              {SHOULD_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {value === 'have.length' && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.lengthValue`}
          control={control}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Enter length (e.g., 3)" className="flex-1" />
          )}
        />
      )}

      {(value === 'contain' || value === 'not.contain') && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.containedText`}
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              {...field}
              placeholder={value === 'not.contain' ? 'Enter text not to contain' : 'Enter text to contain'}
              className="flex-1"
            />
          )}
        />
      )}

      {(value === 'be.equal' || value === 'not.be.equal') && (
        <Controller
          name={`testCases.${testCaseIndex}.steps.${stepIndex}.equalText`}
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              {...field}
              placeholder={value === 'not.be.equal' ? 'Enter text not to be equal' : 'Enter text to be equal'}
              className="flex-1"
            />
          )}
        />
      )}
    </>
  )
}
