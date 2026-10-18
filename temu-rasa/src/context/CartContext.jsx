import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const seedOrders = [
  { id: 'TR001234', date: '12 Mei 2025', status: 'Selesai', total: 48000, items: ['Nasi Ayam Geprek x2', 'Es Kopi Susu x1'] },
  { id: 'TR001233', date: '10 Mei 2025', status: 'Dikirim', total: 36000, items: ['Nasi Rendang x1', 'Thai Tea x1'] },
  { id: 'TR001232', date: '8 Mei 2025', status: 'Diproses', total: 52000, items: ['Mie Ayam Special x2', 'French Fries x1'] },
]

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orders, setOrders] = useState(seedOrders)

  const key = (p, v) => `${p.id}-${v}`

  const addItem = (product, qty = 1, variant = '') => {
    setItems((prev) => {
      const k = key(product, variant)
      const found = prev.find((i) => i.key === k)
      if (found) return prev.map((i) => (i.key === k ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { key: k, product, variant, qty }]
    })
    setCartOpen(true)
  }
  const inc = (k) => setItems((p) => p.map((i) => (i.key === k ? { ...i, qty: i.qty + 1 } : i)))
  const dec = (k) =>
    setItems((p) => p.map((i) => (i.key === k ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0))
  const remove = (k) => setItems((p) => p.filter((i) => i.key !== k))
  const clear = () => setItems([])

  const placeOrder = (total) => {
    const id = 'TR' + String(1235 + orders.length - 3).padStart(6, '0')
    const order = {
      id, total, status: 'Diproses',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: items.map((i) => `${i.product.name} x${i.qty}`),
    }
    setOrders((o) => [order, ...o])
    clear()
    return order
  }

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, subtotal, count, addItem, inc, dec, remove, clear, cartOpen, setCartOpen, orders, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  )
}
