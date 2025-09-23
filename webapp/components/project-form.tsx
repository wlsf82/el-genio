'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProject } from '@/services/projects'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

type FormData = {
  name: string
  description: string
}

export const ProjectForm = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createProject(data)
      router.push('/')
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Project Name
        </label>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Project name is required',
            minLength: {
              value: 3,
              message: 'Project name must be at least 3 characters',
            },
          }}
          render={({ field }) => (
            <Input {...field} id="name" className="w-full bg-white" placeholder="Enter project name" />
          )}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              className="w-full bg-white min-h-[100px]"
              placeholder="Enter project description"
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
