import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { rupiah } from '../data/menu'
import { Thumb } from './FoodCard'
import Button from './Button'

export default function CartModal() {
  const { items, subtotal, inc, dec, remove, cartOpen, setCartOpen } = useCart()
  const { user, openModal } = useAuth()
  const navigate = useNavigate()
  const close = () => setCartOpen(false)

  // Tekan Esc = tutup keranjang
  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  // Kunci scroll halaman di belakang saat keranjang terbuka
  useEffect(() => {
    if (!cartOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [cartOpen])

  const handleRemove = (item) => {
    remove(item.key)
    toast(`${item.product.name} dihapus dari keranjang`)
  }

  // Jika pengunjung belum login tapi keranjang terbuka, tampilkan konfirmasi login
  if (!user && cartOpen) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div onClick={close} className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-7 text-center shadow-2xl">
          <button onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-navy/40 hover:bg-navy/5">
            <X size={18} />
          </button>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sun-soft text-navy">
            <ShoppingBag size={28} />
          </div>
          <h3 className="mt-3 font-display text-xl font-black text-navy">Keranjang Belanja</h3>
          <p className="mt-2 text-xs text-navy/70 leading-relaxed">
            Silakan masuk akun terlebih dahulu untuk melihat dan menggunakan keranjang belanja Anda.
          </p>
          <Button
            variant="accent"
            size="md"
            className="mt-5 w-full justify-center"
            onClick={() => {
              close()
              openModal('login')
            }}
          >
            Masuk Akun Sekarang
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      aria-hidden={!cartOpen}
      className={`fixed inset-0 z-[60] ${
        cartOpen ? 'visible' : 'pointer-events-none invisible delay-300 [transition-property:visibility]'
      }`}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-navy-dark/50 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
          <h2 className="font-display text-2xl font-black italic text-navy">Keranjang Belanja</h2>
          <button
            onClick={close}
            aria-label="Tutup keranjang"
            className="rounded-full p-2 text-navy transition-colors hover:bg-navy/5"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sun-soft">
              <ShoppingBag size={40} className="text-navy" />
            </span>
            <p className="font-display text-2xl font-black text-navy">Keranjangmu masih kosong</p>
            <p className="font-script text-2xl font-bold text-navy-light">Pilih menu favoritmu dulu, yuk.</p>
            <Button to="/menu" onClick={close} variant="accent" className="mt-3">Lihat Menu</Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3 rounded-3xl bg-white p-3 shadow-card">
                  <Thumb p={i.product} size="text-3xl" className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-base font-bold leading-tight text-navy-dark">{i.product.name}</p>
                      <button
                        onClick={() => handleRemove(i)}
                        aria-label={`Hapus ${i.product.name}`}
                        className="shrink-0 rounded-full p-1.5 text-navy/45 transition-colors hover:bg-chili/10 hover:text-chili"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {i.variant && <p className="text-xs font-semibold text-navy/55">{i.variant}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <p className="font-extrabold text-navy">{rupiah(i.product.price)}</p>
                      <div className="flex items-center rounded-full bg-cream p-0.5">
                        <button
                          onClick={() => dec(i.key)}
                          aria-label="Kurangi"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-navy transition-colors hover:bg-white active:scale-95"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-extrabold text-navy" aria-live="polite">{i.qty}</span>
                        <button
                          onClick={() => inc(i.key)}
                          aria-label="Tambah"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-navy transition-colors hover:bg-white active:scale-95"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 rounded-t-[2rem] bg-white px-5 pb-6 pt-5 shadow-[0_-12px_30px_-18px_rgba(15,56,112,0.35)]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-dark/70">Subtotal</span>
                <span className="text-2xl font-extrabold text-navy">{rupiah(subtotal)}</span>
              </div>
              <p className="text-xs text-navy/55">Ongkir & diskon dihitung saat checkout.</p>
              <Button
                variant="accent"
                size="lg"
                className="w-full justify-center"
                onClick={() => {
                  if (!user) {
                    close()
                    openModal('login')
                    toast('Silakan masuk akun terlebih dahulu untuk memesan', { icon: '🔐' })
                  } else {
                    close()
                    navigate('/checkout')
                  }
                }}
              >
                Lanjut ke Checkout <ArrowRight size={18} />
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}