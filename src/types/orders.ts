export const OrderStatus = {
  Pending: 1,
  Confirmed: 2,
  Cancelled: 3,
  Completed: 4,
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export interface OrderItemResponse {
  orderItemId: string
  productId: string
  productName: string | null
  quantity: number
  unitPrice: number
}

export interface AdminOrderResponse {
  orderId: string
  email: string | null
  items: OrderItemResponse[] | null
  totalPrice: number
  status: OrderStatus
  orderedAt: string
}

export interface CustomerOrderResponse {
  orderId: string
  items: OrderItemResponse[] | null
  totalPrice: number
  status: OrderStatus
  orderedAt: string
}

export interface CreateOrderRequest {
  orderItems: CreateOrderItem[]
}

export interface CreateOrderItem {
  productId: string
  quantity: number
}

export interface UpdateOrderItemRequest {
  orderItems: CreateOrderItem[]
}