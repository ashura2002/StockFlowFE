import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/auth.service'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { homePathForRole } from '../../utils/navigation'
import type { ApiError } from '../../types/api'

function MailIcon() {
  return (
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
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

export function ForgotPasswordPage() {
  const { isAuthenticated, user } = useAuth()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user?.role ?? null)} replace />
  }

  function validate() {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
    } catch (err) {
      const apiError = err as ApiError
      const fieldErrors = apiError.errors ?? {}
      const emailMessage = fieldErrors.Email?.[0] ?? fieldErrors.email?.[0]
      if (emailMessage) {
        setEmailError(emailMessage)
      } else {
        setError(
          apiError.message || 'Failed to send reset link. Please try again.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
            <MailIcon />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we will send you a reset link
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-7 shadow-sm ring-1 ring-gray-200 sm:px-8 sm:py-8">
          {sent ? (
            <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <p>
                A password reset link was sent to {email}. Open it in your
                browser to choose a new password.
              </p>
              <p className="text-xs">
                Didn&apos;t get it? Check your spam folder or try again.
              </p>
            </div>
          ) : (
            <>
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
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  error={emailError}
                  required
                />

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-2.5"
                >
                  Send reset link
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{' '}
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