import type { OrderStatus } from '../types/orders'

export function orderCounts<T extends { status: OrderStatus }>(
  entries: T[],
): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const entry of entries) {
    counts[entry.status] += 1
  }
  return counts
}