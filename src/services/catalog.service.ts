import api from './api'
import type { ProductResponse } from '../types/products'
import type { PaginationParams } from '../types/pagination'

export const catalogService = {
  async list(params?: PaginationParams): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[]>('/Products', {
      params: params ?? {},
    })
    return data
  },

  async getDetails(productId: string): Promise<ProductResponse> {
    const { data } = await api.get<ProductResponse>(
      `/Products/details/${productId}`,
    )
    return data
  },

  async search(
    ProductName: string,
    params?: PaginationParams,
  ): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[]>('/Products/search', {
      params: { ProductName, ...(params ?? {}) },
    })
    return Array.isArray(data) ? data : data ? [data] : []
  },
}