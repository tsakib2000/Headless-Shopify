import { Route, Routes } from 'react-router'
import AboutPage from '../pages/AboutPage.jsx'
import CartPage from '../pages/CartPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ProductPage from '../pages/ProductPage.jsx'
import ShopPage from '../pages/ShopPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/products/:handle" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
