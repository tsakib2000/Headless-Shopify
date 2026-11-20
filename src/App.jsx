import CartProvider from './cart/CartProvider.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import StoreHeader from './components/StoreHeader.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <CartProvider>
      <a className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-paper focus:p-3" href="#main-content">
        Skip to content
      </a>
      <StoreHeader />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <AppRoutes />
      </main>
      <CartDrawer />
    </CartProvider>
  )
}
