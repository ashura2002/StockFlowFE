import { useCallback, useState } from 'react'
import { mockOrdersService } from '../services/orders.mock'

export type OrderAction = 'confirm' | 'cancel' | 'complete'

export function useOrderActions(onSuccess: () => void) {
  const [action, setAction] = useState<OrderAction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runAction = useCallback(
    async (orderId: string, next: OrderAction) => {
      setAction(next)
      setError(null)
      try {
        if (next === 'confirm') await mockOrdersService.confirm(orderId)
        else if (next === 'cancel') await mockOrdersService.cancel(orderId)
        else await mockOrdersService.complete(orderId)
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed')
        throw err
      } finally {
        setAction(null)
      }
    },
    [onSuccess],
  )

  const isRunning = action !== null

  return { confirm: runAction, action, isRunning, error, setError }
}