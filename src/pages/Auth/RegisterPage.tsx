import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/auth.service'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { homePathForRole } from '../../utils/navigation'
import type { ApiError } from '../../types/api'

interface ValidationErrors {
  email?: string
  password?: string
  confirm?: string
}

export function RegisterPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user?.role ?? null)} replace />
  }

  function validate() {
    const errors: ValidationErrors = {}
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
    if (!confirm) {
      errors.confirm = 'Confirm your password'
    } else if (confirm !== password) {
      errors.confirm = 'Passwords do not match'
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
      await authService.register({
        email,
        password,
        confirmPassword: confirm,
      })
      navigate('/login', { state: { registeredEmail: email } })
    } catch (err) {
      const apiError = err as ApiError
      const fieldErrors = apiError.errors ?? {}
      const emailMessage = fieldErrors.Email?.[0] ?? fieldErrors.email?.[0]
      const passwordMessage =
        fieldErrors.Password?.[0] ?? fieldErrors.password?.[0]
      const confirmMessage =
        fieldErrors.ConfirmPassword?.[0] ?? fieldErrors.confirmPassword?.[0]
      if (emailMessage || passwordMessage || confirmMessage) {
        setValidationErrors({
          email: emailMessage,
          password: passwordMessage,
          confirm: confirmMessage,
        })
      } else {
        setError(apiError.message || 'Registration failed. Please try again.')
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
            <img
              src="/Stockflow.png"
              alt="StockFlow logo"
              className="h-8 w-8 rounded object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            StockFlow
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start shopping
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
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              required
            />

            <PasswordInput
              label="Password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationErrors.password}
              required
            />

            <PasswordInput
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={validationErrors.confirm}
              required
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5"
            >
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}