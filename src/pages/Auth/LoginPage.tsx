import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { Role } from '../../types/auth'
import { homePathForRole } from '../../utils/navigation'
import type { ApiError } from '../../types/api'

function EmailIcon() {
  return (
    <svg
      className="h-5 w-5"
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

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as
    | { registeredEmail?: string; resetSuccess?: boolean }
    | null
  const registeredEmail = locationState?.registeredEmail
  const resetSuccess = locationState?.resetSuccess

  const [email, setEmail] = useState(registeredEmail ?? '')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user?.role ?? null)} replace />
  }

  function validate() {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      const signedInUser = await login({ email, password })
      navigate(
        signedInUser.role === Role.Customer ? '/shop' : '/admin/dashboard',
        { replace: true },
      )
    } catch (err) {
      const apiError = err as ApiError
      const fieldErrors = apiError.errors ?? {}
      const emailMessage = fieldErrors.Email?.[0] ?? fieldErrors.email?.[0]
      const passwordMessage =
        fieldErrors.Password?.[0] ?? fieldErrors.password?.[0]
      if (emailMessage || passwordMessage) {
        setValidationErrors({
          email: emailMessage,
          password: passwordMessage,
        })
      } else {
        setError(apiError.message || 'Login failed. Please try again.')
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            StockFlow
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-7 shadow-sm ring-1 ring-gray-200 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {resetSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Password reset successfully. Sign in with your new password.
            </div>
          )}

          {registeredEmail && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Account created for {registeredEmail}. Sign in to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={isSubmitting}>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              icon={<EmailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              required
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="mb-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Reset password
                </Link>
              </div>
              <PasswordInput
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={validationErrors.password}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-gray-600">
          Account removed?{' '}
          <Link
            to="/account-recover"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Recover it
          </Link>
        </p>
      </div>
    </div>
  )
}