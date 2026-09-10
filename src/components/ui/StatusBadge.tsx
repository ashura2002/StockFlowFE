import type { OrderStatus } from '../../types/orders'
import { orderStatusMeta } from './orderStatusMeta'
import { Badge } from './Badge'

interface StatusBadgeProps {
  status: OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = orderStatusMeta[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}