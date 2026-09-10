import type { UserResponse } from '../types/users'
import { Role } from '../types/auth'

function user(
  id: string,
  email: string,
  role: Role,
  createdAt: string,
): UserResponse {
  return { userId: id, email, role, createdAt }
}

const activeUsers: UserResponse[] = [
  user('u1-0000-0000-0000000000000001', 'admin@stockflow.com', Role.Admin, '2024-01-05T09:00:00Z'),
  user('u1-0000-0000-0000000000000002', 'jane.doe@example.com', Role.Customer, '2024-02-14T10:30:00Z'),
  user('u1-0000-0000-0000000000000003', 'john.smith@example.com', Role.Customer, '2024-03-03T15:45:00Z'),
  user('u1-0000-0000-0000000000000004', 'sarah.lee@example.com', Role.Customer, '2024-04-20T08:15:00Z'),
  user('u1-0000-0000-0000000000000005', 'mike.brown@example.com', Role.Customer, '2024-05-11T13:20:00Z'),
  user('u1-0000-0000-0000000000000006', 'emily.wilson@example.com', Role.Customer, '2024-06-02T11:05:00Z'),
  user('u1-0000-0000-0000000000000007', 'david.clark@example.com', Role.Customer, '2024-07-17T16:40:00Z'),
  user('u1-0000-0000-0000000000000008', 'olivia.martin@example.com', Role.Admin, '2024-08-25T09:55:00Z'),
  user('u1-0000-0000-0000000000000009', 'james.taylor@example.com', Role.Customer, '2024-09-09T14:10:00Z'),
  user('u1-0000-0000-0000000000000010', 'sophia.anderson@example.com', Role.Customer, '2024-10-21T12:00:00Z'),
]

const deletedUsers: UserResponse[] = [
  user('u1-0000-0000-00000000000000d1', 'chris.evans@example.com', Role.Customer, '2024-03-18T09:30:00Z'),
  user('u1-0000-0000-00000000000000d2', 'anna.white@example.com', Role.Customer, '2024-07-05T14:25:00Z'),
]

const MOCK_DELAY = 200

export const mockUsersService = {
  async getActive(): Promise<UserResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return [...activeUsers]
  },

  async getDeleted(): Promise<UserResponse[]> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return [...deletedUsers]
  },

  async getById(userId: string): Promise<UserResponse> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const found = [...activeUsers, ...deletedUsers].find(
      (u) => u.userId === userId,
    )
    if (!found) throw new Error('User not found')
    return { ...found }
  },
}
