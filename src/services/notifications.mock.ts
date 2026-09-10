import type { NotificationResponse } from '../types/notifications'

function notification(
  id: string,
  content: string,
  isRead: boolean,
): NotificationResponse {
  return {
    notificationId: id,
    userId: 'u1-0000-0000-0000000000000001',
    content,
    isRead,
  }
}

const notifications: NotificationResponse[] = [
  notification('n1-0000-0000-0000000000000001', 'New order #A1B2C3D4 placed and is awaiting confirmation.', false),
  notification('n1-0000-0000-0000000000000002', 'Product "Wireless Headset" stock is running low.', false),
  notification('n1-0000-0000-0000000000000003', 'Order #E5F6G7H8 has been confirmed.', false),
  notification('n1-0000-0000-0000000000000004', 'Supplier "Tech Distributors Ltd" updated its contact details.', true),
  notification('n1-0000-0000-0000000000000005', 'New customer account registered.', false),
  notification('n1-0000-0000-0000000000000006', 'Order #I9J0K1L2 has been cancelled by the customer.', true),
  notification('n1-0000-0000-0000000000000007', 'Your profile picture was updated successfully.', true),
  notification('n1-0000-0000-0000000000000008', 'Weekly sales report is ready to review.', false),
]

const MOCK_DELAY = 200

export const mockNotificationsService = {
  async getAll(): Promise<NotificationResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return notifications.map((n) => ({ ...n }))
  },

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const found = notifications.find((n) => n.notificationId === notificationId)
    if (!found) throw new Error('Notification not found')
    found.isRead = true
  },

  async delete(notificationId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const idx = notifications.findIndex(
      (n) => n.notificationId === notificationId,
    )
    if (idx === -1) throw new Error('Notification not found')
    notifications.splice(idx, 1)
  },
}