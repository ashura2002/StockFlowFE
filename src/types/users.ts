import type { Role } from './auth'

export interface UserResponse {
  userId: string
  email: string | null
  role: Role
  createdAt: string
}

export interface UserWithProfileResponse {
  userId: string
  email: string | null
  fistName: string | null
  lastName: string | null
  dateOfBirth: string
  address: string | null
  profilePictureUrl: string | null
  profilePicturePublicId: string | null
}

export interface CustomerRegistrationRequest {
  email: string
  password: string
}