import api from './api'
import type { UpdateProfileRequest, UploadedImage } from '../types/profiles'
import type { UserWithProfileResponse } from '../types/users'

export const profilesService = {
  async getMyProfile(): Promise<UserWithProfileResponse> {
    const { data } = await api.get<UserWithProfileResponse>(
      '/Profiles/my-profile',
    )
    return data
  },

  async update(data: UpdateProfileRequest): Promise<void> {
    await api.patch('/Profiles', data)
  },

  async uploadPicture(file: File): Promise<UploadedImage> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.patch<UploadedImage>(
      '/Profiles/profile-picture',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },
}