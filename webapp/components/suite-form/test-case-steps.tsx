'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '../ui/label'
import { SuiteFormTestCaseStepItem } from './test-case-step-item'
import { DEFAULT_TEST_CASE_STEP } from './utils'

export function SuiteFormTestCaseSteps({ testCaseIndex }: { testCaseIndex: number }) {
  const { control } = useFormContext()
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.steps`,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Steps</Label>

        {stepFields.map((stepField, stepIndex) => (
          <SuiteFormTestCaseStepItem
            key={stepField.id}
            testCaseIndex={testCaseIndex}
            stepIndex={stepIndex}
            onRemoveStep={() => removeStep(stepIndex)}
          />
        ))}
      </div>

      <Button type="button" variant="ghost" size="lg" onClick={() => appendStep(DEFAULT_TEST_CASE_STEP)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Step
      </Button>
    </div>
  )
}
