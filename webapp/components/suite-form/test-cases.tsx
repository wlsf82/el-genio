'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '../ui/card'
import { SuiteFormTestCaseSteps } from './test-case-steps'
import type { FormData } from './types'
import { DEFAULT_TEST_CASE_STEP } from './utils'

export function SuiteFormTestCases() {
  const { control } = useFormContext<FormData>()
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    control,
    name: 'test_cases',
  })

  const addTestCase = () => {
    appendTestCase({
      description: '',
      steps: [DEFAULT_TEST_CASE_STEP],
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {testCaseFields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row justify-between">
            <span>Test Case {index + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeTestCase(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Description</Label>
                <Controller
                  name={`test_cases.${index}.description`}
                  control={control}
                  rules={{
                    required: 'Description is required',
                  }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        id="name"
                        className={`w-full bg-white`}
                        placeholder="Enter test case description"
                      />
                    </div>
                  )}
                />
              </div>

              <SuiteFormTestCaseSteps testCaseIndex={index} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="ghost" size="lg" onClick={addTestCase}>
        <Plus className="w-4 h-4 mr-2" />
        Add new test case
      </Button>
    </div>
  )
}
