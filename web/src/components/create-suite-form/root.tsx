'use client'

import { Stack } from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'

interface CreateSuiteFormFields {
  name: string
}

export const CreateSuiteFormRoot = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<CreateSuiteFormFields>({
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = (data: CreateSuiteFormFields) => {
    console.log(data)
  }

  return (
    <FormProvider {...form}>
      <Stack asChild>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </Stack>
    </FormProvider>
  )
}
