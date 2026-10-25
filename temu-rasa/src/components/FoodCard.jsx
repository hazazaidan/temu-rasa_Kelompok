import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { rupiah } from '../data/products'

export function Thumb({ p, className = '', size = 'text-6xl' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`flex items-center justify-center overflow-hidden ${size} ${className}`} style={{ background: p.bg }}>
      {p.image && !failed ? (
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />
      ) : (
        <span role="img" aria-label={p.name} className="transition-transform duration-300 group-hover:scale-110">
          {p.emoji}
        </span>
      )}
    </div>
  )
}

// Label kecil di samping nama menu (opsional)
export const TAGS = {}

// Prop opsional `badge`, contoh: <FoodCard product={p} badge="Best Seller" />
export default function FoodCard({ product: p, badge }) {
  const { addItem } = useCart()
  const { user, openModal } = useAuth()

  const handleAdd = () => {
    if (!user) {
      openModal('login')
      toast('Silakan masuk akun terlebih dahulu untuk memesan menu', { icon: '🔐' })
      return
    }
    addItem(p, 1, p.variants?.[0])
    toast.success(`${p.name} masuk keranjang`)
  }

  return (
    <article className="group flex flex-col rounded-[1.85rem] border border-navy/10 bg-white/95 p-3 shadow-card backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-sun/60 hover:shadow-[0_22px_45px_-14px_rgba(15,56,112,0.24)]">
      <Link to={`/menu/${p.id}`} className="sheen-wrapper relative block overflow-hidden rounded-[1.4rem]">
        <Thumb
          p={p}
          className="aspect-[4/3] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        {badge && (
          <span className="sticker absolute left-2.5 top-2.5 !text-[11px] tr-glow z-20">{badge}</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 px-2 pb-2 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/menu/${p.id}`}
            className="font-display text-base font-bold leading-snug text-navy-dark transition-colors hover:text-navy-light line-clamp-1"
          >
            {p.name}
          </Link>
        </div>

        {/* Dotted Leader Line khas Appetizer */}
        <div aria-hidden="true" className="w-full border-b border-dotted border-navy/15 my-0.5" />

        {p.desc && (
          <p className="line-clamp-2 text-xs leading-relaxed text-navy-dark/65">
            {p.desc}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <span className="font-display text-base font-black text-navy">{rupiah(p.price)}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-navy/60">
              <Star size={11} className="fill-sun text-sun" /> {p.rating}
              <span className="text-[10px] text-navy/40">({p.reviews})</span>
            </span>
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Tambah ${p.name} ke keranjang`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sun text-navy-dark shadow-sun transition-all duration-300 hover:scale-110 hover:bg-sun-deep hover:text-white active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}