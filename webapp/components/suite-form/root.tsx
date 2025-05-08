'use client'

import { createTestSuite, updateTestSuite } from '@/services/suites'
import { TestCase } from '@/types/test-case'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DEFAULT_TEST_CASE_STEP } from './utils'

interface SuiteFormProps {
  children: React.ReactNode
  projectId: string
  defaultValues?: SuiteFormData
  suiteId?: string
}

export type SuiteFormData = {
  name: string
  commandTimeout: number
  testCases: TestCase[]
}

const DEFAULT_VALUES: SuiteFormData = {
  name: '',
  commandTimeout: 4000,
  testCases: [
    {
      description: '',
      steps: [DEFAULT_TEST_CASE_STEP],
    },
  ],
}

export const SuiteFormRoot = ({ children, projectId, defaultValues = DEFAULT_VALUES, suiteId }: SuiteFormProps) => {
  const methods = useForm<SuiteFormData>({ defaultValues: defaultValues })
  const router = useRouter()

  const formatPayload = (data: SuiteFormData) => {
    return {
      name: data.name,
      projectId,
      commandTimeout: data.commandTimeout ?? 4000,
      testCases: data.testCases.map(testCase => ({
        description: testCase.description,
        steps: testCase.steps.map(step => ({
          command: step.command,
          selector: step.selector,
          value: step.value,
          lengthValue: step.lengthValue,
          containedText: step.containedText,
          equalText: step.equalText,
          chainOption: step.chainOption,
        })),
      })),
    }
  }

  const onSubmit = async (data: SuiteFormData) => {
    const payload = formatPayload(data)

    if (!suiteId) {
      try {
        await createTestSuite(payload)
        toast.success('Suite created successfully')
        router.push(`/projects/${projectId}/`)
      } catch (error) {
        console.error('Error creating suite:', error)
        toast.error('Failed to create suite')
      }

      return
    }

    try {
      await updateTestSuite(suiteId, payload)
      toast.success('Suite updated successfully')
      router.push(`/projects/${projectId}/`)
    } catch (error) {
      console.error('Error updating suite:', error)
      toast.error('Failed to update suite')
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
