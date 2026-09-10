import { useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'
import type { UpdateProfileRequest } from '../../types/profiles'
import { ProfileCard } from '../../components/profile/ProfileCard'
import { ProfileForm } from '../../components/profile/ProfileForm'
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm'

export function ProfilePage() {
  const { profile, loading, error, update, uploadPicture } = useProfile()
  const { user, updateUser } = useAuth()

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleSave(data: UpdateProfileRequest) {
    setSaveError(null)
    setSaving(true)
    try {
      await update(data)
      if (user) {
        const name =
          [data.firstName, data.lastName].filter(Boolean).join(' ') ||
          user.email ||
          user.name
        updateUser({ ...user, name })
      }
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
      await uploadPicture(file)
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to upload profile picture',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageContainer
      title="Profile"
      description="Manage your account details"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || !profile ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <Card>
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-52 animate-pulse rounded bg-gray-200" />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="mt-6 space-y-4">
                <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </Card>
          </div>
        </div>
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
                  onSave={handleSave}
                  saving={saving}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              <p className="text-sm text-gray-500">
                Update your account password.
              </p>

              <div className="mt-6">
                <ChangePasswordForm />
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  )
}