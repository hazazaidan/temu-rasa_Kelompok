import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/menu', label: 'Menu' },
  { to: '/pesanan', label: 'Pesanan' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false) // BARU: hanya untuk tampilan (garis bawah saat scroll)
  const { count, setCartOpen } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(`/menu?q=${encodeURIComponent(q)}`)
    setOpen(false)
    setShowSearch(false)
  }
  const linkCls = ({ isActive }) =>
    `relative py-1 text-sm font-bold transition-colors ${isActive ? 'text-navy' : 'text-navy/55 hover:text-navy'}`

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-cream/85 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? 'border-navy/10 shadow-[0_8px_24px_-14px_rgba(15,56,112,0.35)]'
          : 'border-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="logo text-3xl leading-none tracking-tight">Temu Rasa</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[3px] rounded-full bg-sun transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <form
            onSubmit={submit}
            className="hidden items-center rounded-full border border-navy/15 bg-white px-3.5 transition-colors focus-within:border-navy lg:flex"
          >
            <Search size={16} className="text-navy/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nasi, kopi, es teh..."
              className="w-44 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-navy/40 focus-visible:outline-none"
            />
          </form>
          <button
            aria-label="Cari"
            onClick={() => setShowSearch((s) => !s)}
            className="rounded-full p-2.5 text-navy hover:bg-navy/5 lg:hidden"
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Keranjang"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full p-2.5 text-navy hover:bg-navy/5"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun px-1 text-[11px] font-extrabold text-navy-dark ring-2 ring-cream">
                {count}
              </span>
            )}
          </button>
          <button className="ml-1 hidden items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-navy-dark hover:shadow-card-hover active:translate-y-px sm:flex">
            <User size={14} /> Masuk
          </button>
          <button
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
            className="rounded-full p-2.5 text-navy hover:bg-navy/5 md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {showSearch && (
        <form onSubmit={submit} className="container-page border-t border-navy/10 py-3 lg:hidden">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nasi, kopi, es teh..."
            className="input"
          />
        </form>
      )}

      {/* Drawer mobile */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 md:hidden ${
          open ? 'visible' : 'pointer-events-none invisible delay-300 [transition-property:visibility]'
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-navy-dark/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-72 flex-col bg-cream p-6 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="logo text-2xl">Temu Rasa</span>
            <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-navy/5">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-lg font-bold transition-colors ${
                    isActive ? 'bg-sun-soft text-navy' : 'text-navy/60 hover:bg-navy/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <p className="tagline mt-8 px-4">Banyak rasa, satu cerita.</p>
          <button className="mt-auto rounded-full bg-navy py-3.5 font-bold text-white shadow-card transition hover:bg-navy-dark">
            Masuk
          </button>
        </aside>
      </div>
    </header>
  )
}