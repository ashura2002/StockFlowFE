import api from './api'
import type {
  CategoryResponse,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/categories'

export const categoriesService = {
  async getAll(): Promise<CategoryResponse[]> {
    const { data } = await api.get<CategoryResponse[]>('/Categories')
    return data
  },

  async getById(categoryId: string): Promise<CategoryWithProducts> {
    const { data } = await api.get<CategoryWithProducts>(
      `/Categories/${categoryId}`,
    )
    return data
  },

  async create(payload: CreateCategoryRequest): Promise<string> {
    const { data } = await api.post<string>('/Categories', payload)
    return data
  },

  async update(
    categoryId: string,
    payload: UpdateCategoryRequest,
  ): Promise<void> {
    await api.patch(`/Categories/${categoryId}`, payload)
  },

  async delete(categoryId: string): Promise<void> {
    await api.delete(`/Categories/${categoryId}`)
  },
}