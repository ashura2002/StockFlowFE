import api from './api'
import type { AdminOrderResponse, OrderStatus } from '../types/orders'
import type { PaginationParams } from '../types/pagination'

const STATUS_PATHS: Record<OrderStatus, string> = {
  [1]: 'pending-orders',
  [2]: 'confirmed-orders',
  [3]: 'completed-orders',
  [4]: 'cancelled-orders',
}

export const ordersService = {
  async getById(orderId: string): Promise<AdminOrderResponse> {
    const { data } = await api.get<AdminOrderResponse>(`/Orders/${orderId}`)
    return data
  },

  async getByStatus(
    status: OrderStatus,
    params?: PaginationParams,
  ): Promise<AdminOrderResponse[]> {
    const { data } = await api.get<AdminOrderResponse[]>(
      `/Orders/${STATUS_PATHS[status]}`,
      { params: params ?? {} },
    )
    return data
  },

  async getAll(params?: PaginationParams): Promise<AdminOrderResponse[]> {
    const pending = await this.getByStatus(1, params)
    const confirmed = await this.getByStatus(2, params)
    const completed = await this.getByStatus(3, params)
    const cancelled = await this.getByStatus(4, params)
    return [...pending, ...confirmed, ...completed, ...cancelled]
  },

  async confirm(orderId: string): Promise<void> {
    await api.patch(`/Orders/${orderId}/confirm`)
  },

  async cancel(orderId: string): Promise<void> {
    await api.patch(`/Orders/${orderId}/cancel`)
  },

  async complete(orderId: string): Promise<void> {
    await api.patch(`/Orders/${orderId}/complete`)
  },
}