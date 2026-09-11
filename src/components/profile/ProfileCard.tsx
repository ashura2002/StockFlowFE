import { useRef, type ChangeEvent } from 'react'
import type { User } from '../../types/auth'
import { Role } from '../../types/auth'
import type { UserWithProfileResponse } from '../../types/users'
import { RoleBadge } from '../ui/RoleBadge'
import { CameraIcon } from '../ui/icons'
import { formatDate } from '../../utils/format'
import { Card } from '../ui/Card'

interface ProfileCardProps {
  profile: UserWithProfileResponse
  user: User | null
  uploading: boolean
  uploadError: string | null
  onUpload: (file: File) => Promise<void>
}

export function ProfileCard({
  profile,
  user,
  uploading,
  uploadError,
  onUpload,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const firstName = profile.fistName ?? ''
  const lastName = profile.lastName ?? ''
  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || profile.email || 'User'
  const initials = (
    [firstName, lastName].filter(Boolean).map((p) => p.charAt(0).toUpperCase()).join('') ||
    (profile.email?.charAt(0).toUpperCase() ?? 'U')
  ).slice(0, 2)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void onUpload(file)
    e.target.value = ''
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {profile.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-50"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Upload profile picture"
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white ring-2 ring-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CameraIcon className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
          <p className="text-sm text-gray-500">{profile.email ?? '—'}</p>
        </div>

        <RoleBadge role={user?.role ?? Role.Admin} />

        {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      </div>

      <dl className="mt-6 divide-y divide-gray-100 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-gray-500">Date of birth</dt>
          <dd className="text-sm font-medium text-gray-900">
            {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-gray-500">Joined</dt>
          <dd className="text-sm font-medium text-gray-900">
            {user ? formatDate(user.createdAt) : '—'}
          </dd>
        </div>
      </dl>
    </Card>
  )
}