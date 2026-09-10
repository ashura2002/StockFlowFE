import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '../../types/auth'
import { useAuth } from '../../context/AuthContext'

interface RequireRoleProps {
  role: Role
  redirectTo?: string
  children?: React.ReactNode
}

export function RequireRole({
  role,
  redirectTo,
  children,
}: RequireRoleProps) {
  const { isAuthenticated, hasRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasRole(role)) {
    return <Navigate to={redirectTo ?? '/unauthorized'} replace />
  }

  return children ? <>{children}</> : <Outlet />
}