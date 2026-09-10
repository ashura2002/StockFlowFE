import { Button } from '../ui/Button'
import { Modal } from '../shared/Modal'

interface OrderActionConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  error?: string | null
}

export function OrderActionConfirm({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  error = null,
}: OrderActionConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title="Cancel Order" maxWidth="sm">
      <p className="text-sm text-gray-600">
        Are you sure you want to cancel this order? This action cannot be undone.
      </p>
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Keep Order
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Cancel Order
        </Button>
      </div>
    </Modal>
  )
}