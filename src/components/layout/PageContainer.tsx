import type { ReactNode } from 'react'

interface PageContainerProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageContainer({
  title,
  description,
  actions,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {(title || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}