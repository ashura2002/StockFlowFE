import { useEffect, useRef, type ReactNode } from 'react'
import { XIcon } from '../ui/icons'
import { IconButton } from '../ui/IconButton'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`m-auto h-fit w-full ${maxWidthClasses[maxWidth]} rounded-xl bg-white p-0 shadow-xl ring-1 ring-gray-900/10 backdrop:bg-black/40`}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <IconButton label="Close" onClick={onClose}>
          <XIcon className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  )
}