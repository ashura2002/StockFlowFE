import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { UIProvider } from '../context/UIProvider'
import { CartProvider } from '../context/CartProvider'
import { NotificationsProvider } from '../context/NotificationsProvider'
import { AppRoutes } from './routes'

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <UIProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </UIProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}

export default App