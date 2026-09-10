interface IconProps {
  className?: string
}

function baseProps(props: IconProps) {
  return {
    className: props.className ?? 'h-5 w-5',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  } as const
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM14 14h7v7h-7v-7z" />
    </svg>
  )
}

export function BoxesIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />
    </svg>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M9 11a4 4 0 100-8 4 4 0 000 8zM16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 17L17 7m0 0H8m9 0v9" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 5v14m-7-7h14" />
    </svg>
  )
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12.01" />
    </svg>
  )
}

export function ClipboardListIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h6" />
    </svg>
  )
}

export function ShoppingCartIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 4.52a1 1 0 00.9 1.48h11.89a1 1 0 00.9-1.48L17 13M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

export function UserPlusIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M9 11a4 4 0 100-8 4 4 0 000 8zM19 3v6m-3-3h6" />
    </svg>
  )
}

export function TrendDownIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 7l10 10m0 0V8m0 9H8" />
    </svg>
  )
}

export function DollarIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
    </svg>
  )
}

export function UserCircleIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3zM12 17a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}