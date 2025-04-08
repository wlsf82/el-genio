'use client'

import { Field } from '@/components/ui/field'
import { Input } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'

export const CreateSuiteFormDetails = () => {
  const { control } = useFormContext()

  return (
    <Field label="Test suite name">
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input placeholder="Enter test suite name" {...field} />}
      />
    </Field>
  )
}
