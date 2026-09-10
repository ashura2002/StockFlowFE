export interface CreateProfileRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  address: string
}

export interface UploadedImage {
  url: string | null
  publicId: string | null
}