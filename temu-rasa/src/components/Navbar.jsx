import { useEffect, useState, useRef, useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

// Bagian di dalam halaman Beranda (id section harus sama persis)
const sections = [
  { id: 'tentang-kami', label: 'Tentang' },
  { id: 'suasana', label: 'Suasana' },
  { id: 'reservasi', label: 'Reservasi' },
  { id: 'ulasan', label: 'Ulasan' },
]

function Logo({ small = false }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-navy font-display font-black italic text-sun ${
          small ? 'h-9 w-9 text-xl' : 'h-11 w-11 text-2xl'
        }`}
      >
        T
      </span>
      <span className={`font-display font-bold leading-none tracking-tight text-navy ${small ? 'text-2xl' : 'text-[28px]'}`}>
        Temu Rasa
      </span>
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const { count, setCartOpen } = useCart()
  const { user, openModal, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Menu "Pesanan" hanya dimunculkan jika user sudah masuk akun (sesuai akun masing-masing)
  const navLinks = useMemo(() => {
    const items = [
      { to: '/', label: 'Beranda' },
      { to: '/menu', label: 'Menu' },
    ]
    if (user) {
      items.push({ to: '/pesanan', label: 'Pesanan' })
    }
    return items
  }, [user])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const keyword = q.trim()
    navigate(keyword ? `/menu?q=${encodeURIComponent(keyword)}` : '/menu')
    setOpen(false)
    setShowSearch(false)
  }

  // Scroll ke section di Beranda
  const goSection = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (pathname === '/') {
      scroll()
    } else {
      navigate('/')
      setTimeout(scroll, 350)
    }
  }

  const linkCls = ({ isActive }) =>
    `relative py-1 text-[15px] font-semibold transition-colors whitespace-nowrap ${
      isActive ? 'text-navy' : 'text-navy/65 hover:text-navy'
    }`

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-navy/10 bg-cream/85 backdrop-blur-md shadow-[0_8px_24px_-14px_rgba(15,56,112,0.35)]'
          : 'border-transparent bg-cream/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" aria-label="Temu Rasa, ke beranda">
          <Logo />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
          {navLinks.map((l) => (
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
          {sections.map((s) => (
            <a key={s.id} href={`/#${s.id}`} onClick={goSection(s.id)} className={linkCls({ isActive: false })}>
              {s.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search Button */}
          <button
            aria-label="Cari menu"
            aria-expanded={showSearch}
            onClick={() => setShowSearch((s) => !s)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-navy transition-colors hover:bg-navy/5"
          >
            <Search size={18} />
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border-2 border-navy bg-white py-1.5 pl-2 pr-3 text-xs font-bold text-navy shadow-sm transition hover:bg-navy/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-black text-sun">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[80px] truncate sm:inline">{user.name}</span>
                <ChevronDown size={14} className="text-navy/60" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-navy/10">
                  <div className="border-b border-navy/10 px-3 py-2 text-xs">
                    <p className="font-bold text-navy truncate">{user.name}</p>
                    <p className="text-navy/50 truncate">{user.email || user.phone}</p>
                  </div>
                  <Link
                    to="/pesanan"
                    onClick={() => setUserMenuOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/5"
                  >
                    <Package size={15} /> Pesanan Saya
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-chili hover:bg-red-50"
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openModal('login')}
              className="hidden items-center gap-1.5 rounded-full border-2 border-navy px-4 py-2 text-xs font-bold text-navy transition hover:bg-navy/5 active:translate-y-px sm:flex"
            >
              <User size={14} /> Masuk
            </button>
          )}

          {/* Cart Button: hanya muncul ketika user sudah login */}
          {user && (
            <button
              aria-label={`Keranjang, ${count} item`}
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full border border-navy/15 bg-white py-1 pl-3 pr-1 text-sm font-bold text-navy shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-navy xl:pl-3.5 active:scale-95"
            >
              <ShoppingBag size={18} />
              <span className="hidden xl:inline">Keranjang</span>
              <span
                key={count}
                className="tr-anim-bump flex h-7 min-w-7 items-center justify-center rounded-full bg-sun px-1 text-xs font-extrabold text-navy-dark"
              >
                {count}
              </span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
            className="rounded-full p-2 text-navy hover:bg-navy/5 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Inline Search Bar */}
      {showSearch && (
        <form onSubmit={submit} className="container-page border-t border-navy/10 py-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari menu"
            placeholder="Cari nasi goreng, rendang, kopi susu..."
            className="input"
          />
        </form>
      )}

      {/* Drawer mobile */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? 'visible' : 'pointer-events-none invisible delay-300 [transition-property:visibility]'
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-navy-dark/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-cream p-6 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Logo small />
            <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-navy/5">
              <X size={22} />
            </button>
          </div>

          {/* User status in mobile */}
          {user ? (
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-navy/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-black text-sun">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy leading-tight">{user.name}</p>
                    <p className="text-xs text-navy/50">{user.email || user.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-lg p-2 text-chili hover:bg-red-50"
                  aria-label="Keluar"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Mobile Cart Button: hanya muncul saat login */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setCartOpen(true)
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-navy/15 bg-white p-3 text-sm font-bold text-navy shadow-sm transition hover:bg-sun-soft/50"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={18} /> Keranjang Belanja
                </span>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sun px-2 text-xs font-black text-navy-dark">
                  {count} item
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpen(false)
                openModal('login')
              }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white p-3 text-sm font-bold text-navy shadow-sm border border-navy/10 transition hover:bg-navy/5"
            >
              <User size={16} /> Masuk / Daftar Akun
            </button>
          )}

          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2.5 text-base font-bold transition-colors ${
                    isActive ? 'bg-sun-soft text-navy' : 'text-navy/70 hover:bg-navy/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                onClick={goSection(s.id)}
                className="rounded-2xl px-4 py-2.5 text-base font-bold text-navy/70 transition-colors hover:bg-navy/5"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl bg-sun-soft/50 p-4 text-xs text-navy">
            <p className="font-bold flex items-center gap-1.5 text-navy">
              <Sparkles size={14} className="text-sun" /> Resto & Kuliner Nusantara
            </p>
            <p className="mt-1 text-navy/70">Layanan Santap di Tempat & Pesan Antar</p>
            <p className="text-navy/70">Setiap hari: 08.00 - 22.00 WIB</p>
          </div>

          <Button
            to="/#reservasi"
            variant="accent"
            size="lg"
            className="mt-6 w-full justify-center"
            onClick={goSection('reservasi')}
          >
            Reservasi Meja
          </Button>
        </aside>
      </div>
    </header>
  )
}
