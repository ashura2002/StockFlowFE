import api from './api'
import type { UserResponse } from '../types/users'
import type { PaginationParams } from '../types/pagination'

export const usersService = {
  async getActive(params?: PaginationParams): Promise<UserResponse[]> {
    const { data } = await api.get<UserResponse[]>('/Users/active', {
      params: params ?? {},
    })
    return data
  },

  async getDeleted(): Promise<UserResponse[]> {
    const { data } = await api.get<UserResponse[]>('/Users/deleted')
    return data
  },

  async getById(userId: string): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>(`/Users/${userId}`)
    return data
  },

  async searchByEmail(
    Email: string,
    params?: PaginationParams,
  ): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/Users/search', {
      params: { Email, ...(params ?? {}) },
    })
    return data
  },

  async deleteMyAccount(): Promise<void> {
    await api.delete('/Users/me')
  },
}
