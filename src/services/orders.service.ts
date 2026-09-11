import api from './api'
import type { AdminOrderResponse } from '../types/orders'
import { OrderStatus } from '../types/orders'
import type { PaginationParams } from '../types/pagination'

const STATUS_PATHS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'pending-orders',
  [OrderStatus.Confirmed]: 'confirmed-orders',
  [OrderStatus.Cancelled]: 'cancelled-orders',
  [OrderStatus.Completed]: 'completed-orders',
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
    const pending = await this.getByStatus(OrderStatus.Pending, params)
    const confirmed = await this.getByStatus(OrderStatus.Confirmed, params)
    const completed = await this.getByStatus(OrderStatus.Completed, params)
    const cancelled = await this.getByStatus(OrderStatus.Cancelled, params)
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