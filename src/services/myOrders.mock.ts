import type {
  CustomerOrderResponse,
  CreateOrderItem,
  OrderItemResponse,
  OrderStatus,
} from '../types/orders'
import { OrderStatus as Status } from '../types/orders'

function item(
  id: string,
  productId: string,
  productName: string,
  quantity: number,
  unitPrice: number,
): OrderItemResponse {
  return { orderItemId: id, productId, productName, quantity, unitPrice }
}

let orderSeq = 100
let itemSeq = 1

function nextOrderId(): string {
  return `c0ffee00-0000-0000-0000-${String(orderSeq++).padStart(12, '0')}`
}
function nextItemId(): string {
  return `c0ffee00-0000-0000-aaaa-${String(itemSeq++).padStart(12, '0')}`
}

const seedOrders: CustomerOrderResponse[] = [
  {
    orderId: 'c0ffee00-0000-0000-0000000000000001',
    items: [
      item('c0ffee00-0000-0000-aaaa-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 'Mechanical Keyboard K87', 1, 89.99),
      item('c0ffee00-0000-0000-aaaa-000000000002', 'a1b2c3d4-0001-0000-0000-000000000002', 'Wireless Mouse M280', 2, 29.99),
    ],
    totalPrice: 149.97,
    status: Status.Pending,
    orderedAt: '2026-09-05T09:20:00Z',
  },
  {
    orderId: 'c0ffee00-0000-0000-0000000000000002',
    items: [
      item('c0ffee00-0000-0000-aaaa-000000000003', 'a1b2c3d4-0001-0000-0000-000000000008', 'Webcam HD 1080p', 1, 39.99),
    ],
    totalPrice: 39.99,
    status: Status.Confirmed,
    orderedAt: '2026-09-04T14:35:00Z',
  },
  {
    orderId: 'c0ffee00-0000-0000-0000000000000003',
    items: [
      item('c0ffee00-0000-0000-aaaa-000000000004', 'a1b2c3d4-0001-0000-0000-000000000010', 'Gaming Headset HS50', 1, 69.99),
      item('c0ffee00-0000-0000-aaaa-000000000005', 'a1b2c3d4-0001-0000-0000-000000000011', 'Desk Lamp LED', 2, 24.99),
    ],
    totalPrice: 119.97,
    status: Status.Completed,
    orderedAt: '2026-08-28T11:02:00Z',
  },
  {
    orderId: 'c0ffee00-0000-0000-0000000000000004',
    items: [
      item('c0ffee00-0000-0000-aaaa-000000000006', 'a1b2c3d4-0001-0000-0000-000000000012', 'Ethernet Cable Cat6 5m', 10, 7.99),
    ],
    totalPrice: 79.9,
    status: Status.Cancelled,
    orderedAt: '2026-08-25T16:45:00Z',
  },
]

const orders: CustomerOrderResponse[] = [...seedOrders.map((o) => ({ ...o, items: o.items ? [...o.items] : null }))]

const MOCK_DELAY = 250

export const mockMyOrdersService = {
  async list(): Promise<CustomerOrderResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return orders.map((o) => ({ ...o, items: o.items ? [...o.items] : null }))
  },

  async getDetails(orderId: string): Promise<CustomerOrderResponse> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    return { ...order, items: order.items ? [...order.items] : null }
  },

  async create(items: CreateOrderItem[]): Promise<string> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    if (items.length === 0) throw new Error('Cannot place an empty order')
    const orderId = nextOrderId()
    const newItems = items.map((ci) =>
      item(nextItemId(), ci.productId, `Product ${ci.productId.slice(0, 8)}`, ci.quantity, 10 + ci.quantity),
    )
    const totalPrice = newItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
    orders.unshift({
      orderId,
      items: newItems,
      totalPrice,
      status: Status.Pending,
      orderedAt: new Date().toISOString(),
    })
    return orderId
  },

  async updateItems(orderId: string, items: CreateOrderItem[]): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    if (order.status !== Status.Pending)
      throw new Error('Only pending orders can be edited')
    order.items = items.map((ci) =>
      item(nextItemId(), ci.productId, `Product ${ci.productId.slice(0, 8)}`, ci.quantity, 10 + ci.quantity),
    )
    order.totalPrice = order.items.reduce(
      (sum, it) => sum + it.unitPrice * it.quantity,
      0,
    )
  },

  async cancel(orderId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    if (order.status !== Status.Pending)
      throw new Error('Only pending orders can be cancelled')
    order.status = Status.Cancelled
  },
}

export function myOrderCounts(
  entries: CustomerOrderResponse[],
): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const order of entries) {
    counts[order.status] += 1
  }
  return counts
}
