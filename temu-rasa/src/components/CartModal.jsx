import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { rupiah } from '../data/products'
import { Thumb } from './FoodCard'
import Button from './Button'

export default function CartModal() {
  const { items, subtotal, inc, dec, remove, cartOpen, setCartOpen } = useCart()
  const close = () => setCartOpen(false)

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
                        onClick={() => remove(i.key)}
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
              <p className="text-xs text-navy/55">Ongkir dihitung saat checkout.</p>
              <Button to="/checkout" onClick={close} variant="accent" size="lg" className="w-full">Checkout</Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}