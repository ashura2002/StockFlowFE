import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { Button } from '../../components/ui/Button'
import { PasswordInput } from '../../components/ui/PasswordInput'
import type { ApiError } from '../../types/api'

interface ResetErrors {
  password?: string
  confirm?: string
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? searchParams.get('rawToken') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<ResetErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function validate(): boolean {
    const errs: ResetErrors = {}
    if (!password) {
      errs.password = 'New password is required'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }
    if (!confirm) {
      errs.confirm = 'Confirm your new password'
    } else if (confirm !== password) {
      errs.confirm = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await authService.resetPassword({ rawToken: token, newPassword: password })
      navigate('/login', { state: { resetSuccess: true } })
    } catch (err) {
      const apiError = err as ApiError
      setError(
        apiError.message || 'Failed to reset password. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="rounded-2xl bg-white px-5 py-7 text-center shadow-sm ring-1 ring-gray-200 sm:px-8 sm:py-8">
            <p className="text-sm text-red-600">
              Invalid or missing reset token. Please request a new reset link.
            </p>
            <Link
              to="/forgot-password"
              className="mt-4 inline-block font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create new password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose a new password for your account
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-7 shadow-sm ring-1 ring-gray-200 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-busy={isSubmitting}
          >
            <PasswordInput
              label="New password"
              autoComplete="new-password"
              placeholder="Enter a new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: '' }))
              }}
              error={errors.password}
              required
            />

            <PasswordInput
              label="Confirm new password"
              autoComplete="new-password"
              placeholder="Repeat the new password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                setErrors((prev) => ({ ...prev, confirm: '' }))
              }}
              error={errors.confirm}
              required
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5"
            >
              Reset password
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered it?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}