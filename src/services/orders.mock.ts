import type { AdminOrderResponse, OrderItemResponse, OrderStatus } from '../types/orders'

function item(
  id: string,
  productId: string,
  productName: string,
  quantity: number,
  unitPrice: number,
): OrderItemResponse {
  return { orderItemId: id, productId, productName, quantity, unitPrice }
}

const seedOrders: AdminOrderResponse[] = [
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000001',
    email: 'acme@example.com',
    items: [
      item('i1', 'p1', 'Mechanical Keyboard K87', 2, 89.99),
      item('i2', 'p2', 'Wireless Mouse M280', 1, 29.99),
    ],
    totalPrice: 209.97,
    status: 1,
    orderedAt: '2026-09-04T10:15:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000002',
    email: 'bluesky@example.com',
    items: [
      item('i3', 'p3', 'USB-C Cable 2m', 50, 9.99),
      item('i4', 'p4', 'USB-C Dock 8-in-1', 3, 59.99),
    ],
    totalPrice: 679.47,
    status: 2,
    orderedAt: '2026-09-04T08:45:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000003',
    email: 'green@example.com',
    items: [
      item('i5', 'p5', '27" IPS Monitor', 1, 349.99),
      item('i6', 'p6', 'Laptop Stand Pro', 2, 45.0),
    ],
    totalPrice: 439.99,
    status: 3,
    orderedAt: '2026-09-03T16:30:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000004',
    email: 'hightide@example.com',
    items: [
      item('i7', 'p7', 'Ergonomic Office Chair', 1, 299.99),
    ],
    totalPrice: 299.99,
    status: 4,
    orderedAt: '2026-09-03T11:20:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000005',
    email: 'northwind@example.com',
    items: [
      item('i8', 'p8', 'Webcam HD 1080p', 4, 39.99),
      item('i9', 'p9', 'Desk Lamp LED', 2, 24.99),
    ],
    totalPrice: 209.94,
    status: 1,
    orderedAt: '2026-09-02T14:05:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000006',
    email: 'riverbend@example.com',
    items: [
      item('i10', 'p10', 'Gaming Headset HS50', 1, 69.99),
      item('i11', 'p11', 'Notebook A5 Lined', 12, 4.99),
    ],
    totalPrice: 129.87,
    status: 2,
    orderedAt: '2026-09-02T09:00:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000007',
    email: 'summit@example.com',
    items: [
      item('i12', 'p12', 'Ethernet Cable Cat6 5m', 20, 7.99),
    ],
    totalPrice: 159.8,
    status: 3,
    orderedAt: '2026-09-01T13:40:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000008',
    email: 'amber@example.com',
    items: [
      item('i13', 'p13', 'Wireless Mouse M280', 3, 29.99),
      item('i14', 'p14', 'Mechanical Keyboard K87', 1, 89.99),
    ],
    totalPrice: 179.96,
    status: 4,
    orderedAt: '2026-09-01T08:10:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000009',
    email: 'lakeside@example.com',
    items: [
      item('i15', 'p15', '27" IPS Monitor', 2, 349.99),
    ],
    totalPrice: 699.98,
    status: 1,
    orderedAt: '2026-08-31T15:55:00Z',
  },
  {
    orderId: 'b2c3d4e5-0001-0000-0000-000000000010',
    email: 'coastal@example.com',
    items: [
      item('i16', 'p16', 'USB-C Dock 8-in-1', 1, 59.99),
      item('i17', 'p17', 'Desk Lamp LED', 1, 24.99),
    ],
    totalPrice: 84.98,
    status: 2,
    orderedAt: '2026-08-31T10:25:00Z',
  },
]

const orders: AdminOrderResponse[] = [...seedOrders]

const MOCK_DELAY = 250

export const mockOrdersService = {
  async getAll(): Promise<AdminOrderResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return orders.map((o) => ({
      ...o,
      items: o.items ? [...o.items] : null,
    }))
  },

  async getById(orderId: string): Promise<AdminOrderResponse> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    return { ...order, items: order.items ? [...order.items] : null }
  },

  async confirm(orderId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    if (order.status !== 1) throw new Error('Only pending orders can be confirmed')
    order.status = 2
  },

  async cancel(orderId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    if (order.status !== 1) throw new Error('Only pending orders can be cancelled')
    order.status = 4
  },

  async complete(orderId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const order = orders.find((o) => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    if (order.status !== 2) throw new Error('Only confirmed orders can be completed')
    order.status = 3
  },
}

export function orderCounts(entries: AdminOrderResponse[]): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const order of entries) {
    counts[order.status] += 1
  }
  return counts
}