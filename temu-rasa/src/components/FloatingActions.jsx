import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 350)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    'Halo Temu Rasa! Saya ingin tanya seputar menu atau reservasi meja.'
  )}`

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-7 sm:right-7 print:hidden">
      {/* Tombol Back to Top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy hover:bg-navy hover:text-white active:scale-95 ${
          showTop ? 'translate-y-0 opacity-100 scale-100' : 'pointer-events-none translate-y-4 opacity-0 scale-75'
        }`}
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>

      {/* Tombol WhatsApp Cepat dengan Animasi Pulsa */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_-5px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 tr-pulse-ring"
      >
        <WhatsAppIcon size={28} className="transition-transform group-hover:scale-110" />

        {/* Tooltip Hover */}
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-navy px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 sm:block hidden">
          Chat Resto & Reservasi
          <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-navy" />
        </span>
      </a>
    </div>
  )
}
