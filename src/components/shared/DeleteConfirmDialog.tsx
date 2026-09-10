import { Button } from '../ui/Button'
import { Modal } from './Modal'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
  error?: string | null
  confirmLabel?: string
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  error = null,
  confirmLabel = 'Delete',
}: DeleteConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="sm">
      <p className="text-sm text-gray-600">{message}</p>
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}