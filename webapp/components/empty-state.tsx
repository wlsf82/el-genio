import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  children?: ReactNode
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
        {children}
      </div>
    </div>
  )
}
