import type { ReactNode } from 'react'
import { badgeVariantClasses, type BadgeVariant } from './badgeStyles'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeVariantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}