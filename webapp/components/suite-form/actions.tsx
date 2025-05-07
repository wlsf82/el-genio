'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { SuiteFormData } from './root'

export function SuiteFormActions({ className }: { className?: string }) {
  const router = useRouter()
  const {
    formState: { isSubmitting },
  } = useFormContext<SuiteFormData>()

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" variant="outline" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </Button>
    </div>
  )
}
