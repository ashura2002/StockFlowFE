import { useCallback, useEffect, useState } from 'react'
import type { UpdateProfileRequest, UploadedImage } from '../types/profiles'
import type { UserWithProfileResponse } from '../types/users'
import { mockProfilesService } from '../services/profiles.mock'

export function useProfile() {
  const [profile, setProfile] = useState<UserWithProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await mockProfilesService.getMyProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const update = useCallback(
    async (data: UpdateProfileRequest) => {
      await mockProfilesService.update(data)
      await refresh()
    },
    [refresh],
  )

  const uploadPicture = useCallback(
    async (file: File): Promise<UploadedImage> => {
      const uploaded = await mockProfilesService.uploadPicture(file)
      await refresh()
      return uploaded
    },
    [refresh],
  )

  return { profile, loading, error, update, uploadPicture, refresh }
}