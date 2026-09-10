import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { CreateOrderItem } from '../types/orders'
import { CartContext, type CartLine } from './CartContext'

const CART_KEY = 'stockflow.cart'

function loadCart(): CartLine[] {
  const stored = localStorage.getItem(CART_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCart)

  const persist = useCallback((next: CartLine[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }, [])

  const add = useCallback(
    (productId: string, quantity: number) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        const next = existing
          ? prev.map((l) =>
              l.productId === productId
                ? { ...l, quantity: l.quantity + quantity }
                : l,
            )
          : [...prev, { productId, quantity }]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setLines((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((l) => l.productId !== productId)
            : prev.map((l) =>
                l.productId === productId ? { ...l, quantity } : l,
              )
        persist(next)
        return next
      })
    },
    [persist],
  )

  const remove = useCallback(
    (productId: string) => {
      setLines((prev) => {
        const next = prev.filter((l) => l.productId !== productId)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const clear = useCallback(() => {
    setLines([])
    localStorage.removeItem(CART_KEY)
  }, [])

  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const toOrderItems = useCallback(
    (): CreateOrderItem[] =>
      lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      count,
      add,
      updateQuantity,
      remove,
      clear,
      toOrderItems,
    }),
    [lines, count, add, updateQuantity, remove, clear, toOrderItems],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}