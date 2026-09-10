import { Outlet } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { useCart } from '../../context/CartContext'
import { Sidebar } from '../layout/Sidebar'
import { AppHeader } from '../layout/Header'
import { shopNavItems } from './shopNav'

export function ShopLayout() {
  const { sidebarOpen, toggleSidebar, sidebarCollapsed, toggleSidebarCollapsed } =
    useUI()
  const { count } = useCart()

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
        items={shopNavItems(count)}
        brandLabel="StockFlow Shop"
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <AppHeader onMenuClick={toggleSidebar} variant="shop" />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  )
}