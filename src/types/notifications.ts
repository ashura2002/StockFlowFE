export interface NotificationResponse {
  notificationId: string
  userId: string
  content: string | null
  isRead: boolean
}