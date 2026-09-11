import type {
  AccountRestoreConfirmPayload,
  AccountRestoreRequestPayload,
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types/auth'
import { Role } from '../types/auth'
import type { UserWithProfileResponse } from '../types/users'
import { decodeJwtRole } from '../utils/jwt'
import api from './api'

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data: loginData } = await api.post<
      { message: string | null; accessToken: string | null }
    >('/Auth/login', payload)

    const accessToken = loginData.accessToken
    if (!accessToken) {
      throw new Error(loginData.message ?? 'Login failed')
    }

    const { data: profile } = await api.get<UserWithProfileResponse>(
      '/Profiles/my-profile',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )

    const displayName =
      [profile.fistName, profile.lastName].filter(Boolean).join(' ') ||
      profile.email ||
      'User'

    return {
      accessToken,
      user: {
        id: profile.userId,
        email: profile.email ?? '',
        name: displayName,
        role: decodeJwtRole(accessToken) ?? Role.Admin,
        createdAt: new Date().toISOString(),
        profilePictureUrl: profile.profilePictureUrl ?? null,
      },
    }
  },

  async register(payload: RegisterPayload): Promise<string> {
    const { data } = await api.post<string>('/Users/register', payload)
    return data
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/Auth/forgot-password', payload)
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/Auth/reset-password', payload)
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.put('/Users/me/password', payload)
  },

  async requestAccountRestore(
    payload: AccountRestoreRequestPayload,
  ): Promise<void> {
    await api.post('/Auth/account-restore/request', payload)
  },

  async confirmAccountRestore(
    payload: AccountRestoreConfirmPayload,
  ): Promise<void> {
    await api.post('/Auth/account-restore/confirm', payload)
  },
}