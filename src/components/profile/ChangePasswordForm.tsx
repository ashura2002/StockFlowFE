import { useState, type FormEvent } from 'react'
import { authService } from '../../services/auth.service'
import type { ApiError } from '../../types/api'
import { Button } from '../ui/Button'
import { PasswordInput } from '../ui/PasswordInput'

interface ChangePasswordErrors {
  current?: string
  next?: string
  confirm?: string
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [errors, setErrors] = useState<ChangePasswordErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerError, setBannerError] = useState('')
  const [success, setSuccess] = useState('')

  function clearField(field: keyof ChangePasswordErrors) {
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const errs: ChangePasswordErrors = {}
    if (!currentPassword) {
      errs.current = 'Current password is required'
    }
    if (!newPassword) {
      errs.next = 'New password is required'
    } else if (newPassword.length < 6) {
      errs.next = 'Password must be at least 6 characters'
    } else if (newPassword === currentPassword) {
      errs.next = 'New password must be different from the current one'
    }
    if (!confirmNewPassword) {
      errs.confirm = 'Confirm your new password'
    } else if (confirmNewPassword !== newPassword) {
      errs.confirm = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBannerError('')
    setSuccess('')
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      setSuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      const apiError = err as ApiError
      const fieldErrors = apiError.errors ?? {}
      const currentMessage =
        fieldErrors.CurrentPassword?.[0] ??
        fieldErrors.currentPassword?.[0]
      const newMessage =
        fieldErrors.NewPassword?.[0] ?? fieldErrors.newPassword?.[0]
      const confirmMessage =
        fieldErrors.ConfirmNewPassword?.[0] ??
        fieldErrors.confirmNewPassword?.[0]
      if (currentMessage || newMessage || confirmMessage) {
        setErrors({
          current: currentMessage,
          next: newMessage,
          confirm: confirmMessage,
        })
      } else {
        setBannerError(
          apiError.message || 'Failed to update password. Please try again.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {bannerError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {bannerError}
        </div>
      )}

      <PasswordInput
        label="Current password"
        autoComplete="current-password"
        placeholder="Enter your current password"
        value={currentPassword}
        onChange={(e) => {
          setCurrentPassword(e.target.value)
          clearField('current')
        }}
        error={errors.current}
        required
      />

      <PasswordInput
        label="New password"
        autoComplete="new-password"
        placeholder="Enter a new password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value)
          clearField('next')
        }}
        error={errors.next}
        required
      />

      <PasswordInput
        label="Confirm new password"
        autoComplete="new-password"
        placeholder="Repeat the new password"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value)
          clearField('confirm')
        }}
        error={errors.confirm}
        required
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  )
}