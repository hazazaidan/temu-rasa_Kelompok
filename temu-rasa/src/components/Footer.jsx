import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Instagram, Mail, Clock, ShoppingBag } from 'lucide-react'
import Button from './Button'
import Reveal from './Reveal'

// Link ke section di halaman Beranda (id harus sama dengan id section-nya)
const explore = [
  { label: 'Menu', to: '/menu' },
  { label: 'Tentang kami', section: 'tentang-kami' },
  { label: 'Suasana', section: 'suasana' },
  { label: 'Ulasan', section: 'ulasan' },
  { label: 'Tanya jawab', section: 'faq' },
]
const order = [
  { label: 'Pesan online', to: '/menu' },
  { label: 'Reservasi meja', section: 'reservasi' },
  { label: 'Pesan antar', to: '/menu' },
  { label: 'Pesanan saya', to: '/pesanan' },
]

const linkCls = 'text-navy-dark/75 transition-colors hover:text-navy hover:underline underline-offset-4'

function Heading({ children }) {
  return <h3 className="text-xs font-extrabold uppercase tracking-[0.25em] text-navy">{children}</h3>
}

export default function Footer() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Scroll ke section di Beranda. Kalau sedang di halaman lain, pindah ke Beranda dulu.
  const goSection = (id) => (e) => {
    e.preventDefault()
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (pathname === '/') {
      scroll()
    } else {
      navigate('/')
      setTimeout(scroll, 350)
    }
  }

  const renderLink = (l) =>
    l.to ? (
      <Link to={l.to} className={linkCls}>{l.label}</Link>
    ) : (
      <a href={`/#${l.section}`} onClick={goSection(l.section)} className={linkCls}>{l.label}</a>
    )

  return (
    <footer className="mt-16 border-t-8 border-sun bg-cream">
      <Reveal className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        {/* Merek */}
        <div>
          <Link to="/" aria-label="Temu Rasa, ke beranda" className="inline-flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-2xl font-black italic text-sun"
            >
              T
            </span>
            <span className="font-display text-[28px] font-bold leading-none tracking-tight text-navy">Temu Rasa</span>
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed text-navy-dark/75">
            Tempat santap kuliner Nusantara. Rasa tradisional, sentuhan modern, dan cerita di setiap suapan.
          </p>
        </div>

        {/* Jelajahi */}
        <nav aria-label="Jelajahi">
          <Heading>Jelajahi</Heading>
          <ul className="mt-5 space-y-3.5">
            {explore.map((l) => (
              <li key={l.label}>{renderLink(l)}</li>
            ))}
          </ul>
        </nav>

        {/* Pesan */}
        <nav aria-label="Pesan">
          <Heading>Pesan</Heading>
          <ul className="mt-5 space-y-3.5">
            {order.map((l) => (
              <li key={l.label}>{renderLink(l)}</li>
            ))}
          </ul>
        </nav>

        {/* Layanan Kami */}
        <div>
          <Heading>Layanan Kami</Heading>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-navy-dark/75">
            <p className="font-bold text-navy-dark">Resto & Katering Nusantara</p>
            <p>Melayani santap di tempat, reservasi meja, dan katering prasmanan.</p>
            <p className="text-xs font-semibold text-navy/80">
              <span className="font-bold text-navy">Jam Operasional:</span><br />
              Buka Setiap Hari, 08.00–22.00 WIB
            </p>
          </div>
          <Button to="/menu" variant="accent" size="lg" className="mt-6">
            Mulai pesan
          </Button>
        </div>
      </Reveal>

      <div className="container-page flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 py-6 text-sm text-navy-dark/70">
        <p>© {new Date().getFullYear()} Temu Rasa. Makan enak, ke mana saja!</p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="mailto:halo@temurasa.id" className="inline-flex items-center gap-1.5 transition-colors hover:text-navy">
            <Mail size={15} /> halo@temurasa.id
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Instagram size={15} /> @temurasa
          </span>
        </p>
      </div>
    </footer>
  )
}