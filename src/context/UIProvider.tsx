import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { UIContext } from './UIContext'

const COLLAPSED_KEY = 'stockflow.sidebarCollapsed'

function getInitialCollapsed(): boolean {
  const stored = localStorage.getItem(COLLAPSED_KEY)
  return stored === 'true'
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsed)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((open) => !open)
  }, [])

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((collapsed) => {
      localStorage.setItem(COLLAPSED_KEY, String(!collapsed))
      return !collapsed
    })
  }, [])

  const value = useMemo(
    () => ({ sidebarOpen, toggleSidebar, sidebarCollapsed, toggleSidebarCollapsed }),
    [sidebarOpen, toggleSidebar, sidebarCollapsed, toggleSidebarCollapsed],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}