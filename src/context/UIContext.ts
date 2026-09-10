import { createContext, useContext } from 'react'

export interface UIContextValue {
  sidebarOpen: boolean
  toggleSidebar: () => void
  sidebarCollapsed: boolean
  toggleSidebarCollapsed: () => void
}

export const UIContext = createContext<UIContextValue | undefined>(undefined)

export function useUI(): UIContextValue {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}