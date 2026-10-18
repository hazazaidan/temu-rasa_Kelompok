import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'

const linkCls =
  'w-fit rounded-sm py-0.5 text-white/80 transition-colors hover:text-sun'

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-navy text-white">
      {/* BARU: tepi bergelombang di atas footer */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -top-[39px] h-10 w-full text-navy"
      >
        <path
          fill="currentColor"
          d="M0 40V22C120 6 240 0 360 8s240 24 360 22 240-22 360-26 240 6 360 16v18H0Z"
        />
      </svg>

      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-4xl font-black italic leading-none">Temu Rasa</p>
          <p className="font-script mt-2 text-2xl font-bold text-sun" style={{ transform: 'rotate(-2deg)', transformOrigin: 'left' }}>
            Banyak rasa, satu cerita.
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Tempat makan dan minum yang menggabungkan rasa tradisional dan modern.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-extrabold text-sun">Jelajahi</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <Link to="/" className={linkCls}>Beranda</Link>
            <Link to="/menu" className={linkCls}>Menu</Link>
            <Link to="/pesanan" className={linkCls}>Pesanan Saya</Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-extrabold text-sun">Mampir ke sini</p>
          <div className="space-y-3 text-sm text-white/80">
            <p className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sun">
                <MapPin size={16} />
              </span>
              <span className="pt-1">Jl. Melati No. 12, Bandung</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sun">
                <Clock size={16} />
              </span>
              <span className="pt-1">Setiap hari, 09.00–22.00</span>
            </p>
          </div>
        </div>
      </div>

      <p className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        © 2026 Temu Rasa
      </p>
    </footer>
  )
}