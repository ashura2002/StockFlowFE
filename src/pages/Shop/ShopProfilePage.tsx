import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
} from '../../types/profiles'
import { Card } from '../../components/ui/Card'
import { ProfileCard } from '../../components/profile/ProfileCard'
import { ProfileForm } from '../../components/profile/ProfileForm'
import { ProfileCreateForm } from '../../components/profile/ProfileCreateForm'

export function ShopProfilePage() {
  const { profile, hasProfile, loading, error, create, update, uploadPicture } =
    useProfile()
  const { user, updateUser } = useAuth()

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function syncUserName(data: CreateProfileRequest | UpdateProfileRequest) {
    if (!user) return
    const name =
      [data.firstName, data.lastName].filter(Boolean).join(' ') ||
      user.email ||
      user.name
    updateUser({ ...user, name })
  }

  async function handleCreate(data: CreateProfileRequest) {
    setSaveError(null)
    setSaving(true)
    try {
      await create(data)
      await syncUserName(data)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to create profile',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(data: UpdateProfileRequest) {
    setSaveError(null)
    setSaving(true)
    try {
      await update(data)
      await syncUserName(data)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to update profile',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(file: File) {
    setUploadError(null)
    setUploading(true)
    try {
      const uploaded = await uploadPicture(file)
      if (user) {
        updateUser({ ...user, profilePictureUrl: uploaded.url ?? null })
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to upload profile picture',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500">Manage your account details</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || !profile ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100" />
              <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
            </div>
          </Card>
          <Card>
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded bg-gray-100" />
              <div className="h-10 animate-pulse rounded bg-gray-100" />
              <div className="h-24 animate-pulse rounded bg-gray-100" />
            </div>
          </Card>
        </div>
      ) : !hasProfile ? (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Your Profile
          </h3>
          <p className="text-sm text-gray-500">
            Create your profile with your date of birth to get started.
          </p>

          {saveError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <div className="mt-6">
            <ProfileCreateForm onSave={handleCreate} saving={saving} />
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileCard
              profile={profile}
              user={user}
              uploading={uploading}
              uploadError={uploadError}
              onUpload={handleUpload}
            />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Profile
              </h3>
              <p className="text-sm text-gray-500">
                Update your name and address.
              </p>

              {saveError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="mt-6">
                <ProfileForm
                  key={profile.userId}
                  profile={profile}
                  onSave={handleUpdate}
                  saving={saving}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
