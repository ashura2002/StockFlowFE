import type { Role } from '../../types/auth'
import { Role as RoleValue } from '../../types/auth'
import { Badge } from './Badge'

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === RoleValue.Admin
  return (
    <Badge variant={isAdmin ? 'warning' : 'neutral'}>
      {isAdmin ? 'Admin' : 'Customer'}
    </Badge>
  )
}
