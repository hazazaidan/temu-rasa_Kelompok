import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

// Normalisasi nomor telepon untuk mencocokkan user dengan pesanan
const cleanPhone = (v) => String(v || '').replace(/[\s-]/g, '')

// Baca/tulis localStorage dengan aman (tidak crash kalau storage diblokir atau datanya rusak)
const CART_KEY = 'temurasa-cart'
const ORDERS_KEY = 'temurasa-orders'

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    const data = raw ? JSON.parse(raw) : fallback
    return Array.isArray(data) ? data : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* abaikan: storage penuh atau diblokir */
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => load(CART_KEY, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [userOrders, setUserOrders] = useState(() => load(ORDERS_KEY, []))

  useEffect(() => save(CART_KEY, items), [items])
  useEffect(() => save(ORDERS_KEY, userOrders), [userOrders])

  // Riwayat pesanan hanya ditampilkan jika user sudah login, dan difilter khusus akun tersebut
  const orders = useMemo(() => {
    if (!user) return []
    return userOrders.filter((o) => {
      if (o.userId && (o.userId === user.email || o.userId === user.phone)) return true
      if (o.userEmail && user.email && o.userEmail.toLowerCase() === user.email.toLowerCase()) return true
      if (o.userPhone && user.phone && cleanPhone(o.userPhone) === cleanPhone(user.phone)) return true
      if (o.customer?.email && user.email && o.customer.email.toLowerCase() === user.email.toLowerCase()) return true
      if (o.customer?.hp && user.phone && cleanPhone(o.customer.hp) === cleanPhone(user.phone)) return true
      return false
    })
  }, [userOrders, user])

  const key = (p, v) => `${p.id}-${v}`

  // Catatan: keranjang tidak lagi terbuka otomatis. Umpan baliknya lewat toast
  // (dipanggil di komponen yang menekan tombol tambah).
  const addItem = (product, qty = 1, variant = '') => {
    setItems((prev) => {
      const k = key(product, variant)
      const found = prev.find((i) => i.key === k)
      if (found) return prev.map((i) => (i.key === k ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { key: k, product, variant, qty }]
    })
  }
  const inc = (k) => setItems((p) => p.map((i) => (i.key === k ? { ...i, qty: i.qty + 1 } : i)))
  const dec = (k) =>
    setItems((p) => p.map((i) => (i.key === k ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0))
  const remove = (k) => setItems((p) => p.filter((i) => i.key !== k))
  const clear = () => setItems([])

  // `customer` = data dari form checkout (nama, HP, alamat, dll).
  // Pesanan otomatis diikat ke user yang sedang login agar tidak tertukar antar akun.
  const placeOrder = (total, customer = {}) => {
    const id = 'TR' + String(1235 + userOrders.length).padStart(6, '0')
    const order = {
      id,
      total,
      status: 'Diproses',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: items.map((i) => `${i.product.name} x${i.qty}`),
      customer,
      userId: user?.email || user?.phone || customer.email || customer.hp || 'guest',
      userEmail: user?.email || customer.email || '',
      userPhone: user?.phone || customer.hp || '',
      userName: user?.name || customer.nama || '',
    }
    setUserOrders((o) => [order, ...o])
    clear()
    return order
  }

  const updateOrderStatus = (id, newStatus) => {
    setUserOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
  }

  const deleteOrder = (id) => {
    setUserOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        count,
        addItem,
        inc,
        dec,
        remove,
        clear,
        cartOpen,
        setCartOpen,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}