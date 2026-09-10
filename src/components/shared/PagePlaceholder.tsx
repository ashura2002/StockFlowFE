import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface PagePlaceholderProps {
  title: string
  description: string
  icon?: ReactNode
}

export function PagePlaceholder({
  title,
  description,
  icon,
}: PagePlaceholderProps) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-4 py-12 text-center sm:py-16">
        {icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}