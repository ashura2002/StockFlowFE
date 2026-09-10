import { createContext, useContext } from 'react'
import type { CreateOrderItem } from '../types/orders'

export interface CartLine {
  productId: string
  quantity: number
}

export interface CartContextValue {
  lines: CartLine[]
  count: number
  add: (productId: string, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  toOrderItems: () => CreateOrderItem[]
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
)

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}