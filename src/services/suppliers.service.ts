import api from './api'
import type {
  SupplierResponse,
  SupplierWithProducts,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../types/suppliers'
import type { PaginationParams } from '../types/pagination'

export const suppliersService = {
  async getAll(params?: PaginationParams): Promise<SupplierResponse[]> {
    const { data } = await api.get<SupplierResponse[]>('/Suppliers', {
      params: params ?? {},
    })
    return data
  },

  async getById(supplierId: string): Promise<SupplierWithProducts> {
    const { data } = await api.get<SupplierWithProducts>(
      `/Suppliers/${supplierId}`,
    )
    return data
  },

  async create(payload: CreateSupplierRequest): Promise<string> {
    const { data } = await api.post<string>('/Suppliers', payload)
    return data
  },

  async update(
    supplierId: string,
    payload: UpdateSupplierRequest,
  ): Promise<void> {
    await api.patch(`/Suppliers/${supplierId}`, payload)
  },

  async delete(supplierId: string): Promise<void> {
    await api.delete(`/Suppliers/${supplierId}`)
  },
}