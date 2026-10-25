import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import LoginModal from './components/LoginModal'
import FloatingActions from './components/FloatingActions'
import ScrollProgress from './components/ScrollProgress'

import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'

export default function App() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pesanan" element={<OrderHistory />} />
          <Route path="*" element={<Menu />} />
        </Routes>
      </main>

      <Footer />
      <CartModal />
      <LoginModal />
      <FloatingActions />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '9999px',
            fontWeight: 600,
          },
        }}
      />
    </div>
  )
}