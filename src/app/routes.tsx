import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/shared/ProtectedRoute'
import { RequireRole } from '../components/shared/RequireRole'
import { Layout } from '../components/layout/Layout'
import { LoginPage } from '../pages/Auth/LoginPage'
import { AccountRecoverPage } from '../pages/Auth/AccountRecoverPage'
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/Auth/ResetPasswordPage'
import { RegisterPage } from '../pages/Auth/RegisterPage'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { ProductsPage } from '../pages/Products/ProductsPage'
import { CategoriesPage } from '../pages/Categories/CategoriesPage'
import { SuppliersPage } from '../pages/Suppliers/SuppliersPage'
import { OrdersPage } from '../pages/Orders/OrdersPage'
import { UsersPage } from '../pages/Users/UsersPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { NotificationsPage } from '../pages/Notifications/NotificationsPage'
import { ShopLayout } from '../components/shop/ShopLayout'
import { ShopCatalogPage } from '../pages/Shop/ShopCatalogPage'
import { ShopProductDetailPage } from '../pages/Shop/ShopProductDetailPage'
import { ShopCartPage } from '../pages/Shop/ShopCartPage'
import { ShopMyOrdersPage } from '../pages/Shop/ShopMyOrdersPage'
import { ShopOrderDetailPage } from '../pages/Shop/ShopOrderDetailPage'
import { ShopProfilePage } from '../pages/Shop/ShopProfilePage'
import { Role } from '../types/auth'
import { useAuth } from '../context/AuthContext'
import { homePathForRole } from '../utils/navigation'

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth()
  return (
    <Navigate
      to={isAuthenticated ? homePathForRole(user?.role ?? null) : '/login'}
      replace
    />
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account-recover" element={<AccountRecoverPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RequireRole role={Role.Admin} />}>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole role={Role.Customer} />}>
          <Route path="/shop" element={<ShopLayout />}>
            <Route index element={<ShopCatalogPage />} />
            <Route path="product/:productId" element={<ShopProductDetailPage />} />
            <Route path="cart" element={<ShopCartPage />} />
            <Route path="my-orders" element={<ShopMyOrdersPage />} />
            <Route path="my-orders/:orderId" element={<ShopOrderDetailPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ShopProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}


// forgot and forget password
// recover account  