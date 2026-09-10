import { OrderStatus } from '../../types/orders'
import type { BadgeVariant } from './badgeStyles'

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; variant: BadgeVariant }
> = {
  [OrderStatus.Pending]: { label: 'Pending', variant: 'warning' },
  [OrderStatus.Confirmed]: { label: 'Confirmed', variant: 'info' },
  [OrderStatus.Completed]: { label: 'Completed', variant: 'success' },
  [OrderStatus.Cancelled]: { label: 'Cancelled', variant: 'error' },
}