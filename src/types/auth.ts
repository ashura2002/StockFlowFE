export const Role = {
  Admin: 1,
  Customer: 2,
} as const

export type Role = (typeof Role)[keyof typeof Role]

export interface User {
  id: string
  email: string
  name: string
  role: Role
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface LoginApiResponse {
  message: string | null
  accessToken: string | null
}

export interface AccountRestoreRequestPayload {
  email: string
}

export interface AccountRestoreConfirmPayload {
  email: string
  verificationCode: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  rawToken: string
  newPassword: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}