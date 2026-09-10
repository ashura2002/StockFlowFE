import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { UIProvider } from '../context/UIProvider'
import { CartProvider } from '../context/CartProvider'
import { AppRoutes } from './routes'

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </UIProvider>
    </AuthProvider>
  )
}

export default App