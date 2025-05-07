'use client'

import { createTestSuite } from '@/services/suites'
import { TestCase } from '@/types/test-case'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DEFAULT_TEST_CASE_STEP } from './utils'

interface SuiteFormProps {
  children: React.ReactNode
  projectId: string
}

type FormData = {
  name: string
  commandTimeout: number | null
  testCases: TestCase[]
}

const DEFAULT_VALUES: FormData = {
  name: '',
  commandTimeout: 4000,
  testCases: [
    {
      description: '',
      steps: [DEFAULT_TEST_CASE_STEP],
    },
  ],
}

export const SuiteFormRoot = ({ children, projectId }: SuiteFormProps) => {
  const methods = useForm<FormData>({ defaultValues: DEFAULT_VALUES })
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      await createTestSuite({
        name: data.name,
        projectId,
        commandTimeout: data.commandTimeout ?? undefined,
        testCases: data.testCases.map(testCase => ({
          description: testCase.description,
          steps: testCase.steps.map(step => ({
            command: step.command,
            target: step.selector,
            value: step.value,
            lengthValue: step.lengthValue,
            containedText: step.containedText,
            equalText: step.equalText,
            chainOption: step.chainOption,
          })),
        })),
      })

      toast.success('Suite created successfully')
      router.push(`/projects/${projectId}/`)
    } catch (error) {
      console.error('Error creating suite:', error)
      toast.error('Failed to create suite')
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        {children}
      </form>
    </FormProvider>
  )
}
