import api from './api'
import type { NotificationResponse } from '../types/notifications'

export const notificationsService = {
  async getAll(): Promise<NotificationResponse[]> {
    const { data } = await api.get<NotificationResponse[]>('/Notifications')
    return data
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/Notifications/${notificationId}/read`)
  },

  async delete(notificationId: string): Promise<void> {
    await api.delete(`/Notifications/${notificationId}`)
  },
}