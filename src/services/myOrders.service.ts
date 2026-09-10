import api from './api'
import type {
  CustomerOrderResponse,
  CreateOrderRequest,
  UpdateOrderItemRequest,
} from '../types/orders'
import type { PaginationParams } from '../types/pagination'

export const myOrdersService = {
  async list(params?: PaginationParams): Promise<CustomerOrderResponse[]> {
    const { data } = await api.get<CustomerOrderResponse[]>('/Orders/my-orders', {
      params: params ?? {},
    })
    return data
  },

  async getDetails(orderId: string): Promise<CustomerOrderResponse> {
    const { data } = await api.get<CustomerOrderResponse>(
      `/Orders/my-orders${orderId}/details`,
    )
    return data
  },

  async create(data: CreateOrderRequest): Promise<string> {
    const { data: orderId } = await api.post<string>('/Orders', data)
    return orderId
  },

  async updateItems(
    orderId: string,
    data: UpdateOrderItemRequest,
  ): Promise<void> {
    await api.patch(`/Orders/my-orders/${orderId}`, data)
  },

  async cancel(orderId: string): Promise<void> {
    await api.patch(`/Orders/my-orders/${orderId}/cancel`)
  },
}