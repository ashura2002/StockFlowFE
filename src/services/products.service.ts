import api from './api'
import type {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from '../types/products'

export const productsService = {
  async getAll(): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[]>('/Products')
    return data
  },

  async getById(productId: string): Promise<ProductResponse> {
    const { data } = await api.get<ProductResponse>(
      `/Products/details/${productId}`,
    )
    return data
  },

  async search(productName: string): Promise<ProductResponse[]> {
    const { data } = await api.get<ProductResponse[]>('/Products/search', {
      params: { ProductName: productName },
    })
    return Array.isArray(data) ? data : data ? [data] : []
  },

  async create(payload: CreateProductRequest): Promise<string> {
    const { data } = await api.post<string>('/Products', payload)
    return data
  },

  async update(
    productId: string,
    payload: UpdateProductRequest,
  ): Promise<void> {
    await api.patch(`/Products/${productId}`, payload)
  },

  async delete(productId: string): Promise<void> {
    await api.delete(`/Products/${productId}`)
  },
}