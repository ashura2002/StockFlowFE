import type { UpdateProfileRequest, UploadedImage } from '../types/profiles'
import type { UserWithProfileResponse } from '../types/users'

let profile: UserWithProfileResponse = {
  userId: 'u1-0000-0000-0000000000000001',
  email: 'admin@stockflow.com',
  fistName: 'Alex',
  lastName: 'Morgan',
  dateOfBirth: '1992-06-15',
  address: '123 Market Street, Suite 100, London',
  profilePictureUrl: null,
  profilePicturePublicId: null,
}

const MOCK_DELAY = 200

export const mockProfilesService = {
  async getMyProfile(): Promise<UserWithProfileResponse> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    return { ...profile }
  },

  async update(data: UpdateProfileRequest): Promise<void> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    profile = {
      ...profile,
      fistName: data.firstName,
      lastName: data.lastName,
      address: data.address,
    }
  },

  async uploadPicture(file: File): Promise<UploadedImage> {
    await new Promise((r) => setTimeout(r, MOCK_DELAY))
    const url = URL.createObjectURL(file)
    profile = {
      ...profile,
      profilePictureUrl: url,
      profilePicturePublicId: `mock-${Date.now()}`,
    }
    return { url, publicId: profile.profilePicturePublicId }
  },
}