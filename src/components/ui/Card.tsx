import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6 ${className}`}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  action?: ReactNode
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
  )
}