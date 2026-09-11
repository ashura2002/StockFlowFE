import { useCallback, useEffect, useState } from 'react'
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
  UploadedImage,
} from '../types/profiles'
import type { UserWithProfileResponse } from '../types/users'
import { profilesService } from '../services/profiles.service'

function isEmptyProfile(profile: UserWithProfileResponse): boolean {
  return (
    !profile.fistName &&
    !profile.lastName &&
    !profile.address &&
    !profile.dateOfBirth
  )
}

export function useProfile() {
  const [profile, setProfile] = useState<UserWithProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await profilesService.getMyProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(
    async (data: CreateProfileRequest) => {
      await profilesService.create(data)
      await refresh()
    },
    [refresh],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const update = useCallback(
    async (data: UpdateProfileRequest) => {
      await profilesService.update(data)
      await refresh()
    },
    [refresh],
  )

  const uploadPicture = useCallback(
    async (file: File): Promise<UploadedImage> => {
      const uploaded = await profilesService.uploadPicture(file)
      await refresh()
      return uploaded
    },
    [refresh],
  )

  return {
    profile,
    hasProfile: profile !== null && !isEmptyProfile(profile),
    loading,
    error,
    create,
    update,
    uploadPicture,
    refresh,
  }
}