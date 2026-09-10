import type { DashboardResponseDto } from '../types/dashboard'
import api from './api'

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponseDto> {
    const { data } = await api.get<DashboardResponseDto>('/Dashboard')
    return data
  },
}