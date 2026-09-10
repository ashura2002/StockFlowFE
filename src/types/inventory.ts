import type { ID, Timestamp } from './common'

export interface StockItem {
  id: ID
  productId: ID
  productName: string
  warehouse: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  reorderLevel: number
  updatedAt: Timestamp
}

export interface AdjustmentPayload {
  productId: ID
  quantity: number
  reason: string
}