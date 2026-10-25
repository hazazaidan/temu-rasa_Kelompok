import { useState } from 'react'
import Reveal from './Reveal'

const tiles = [
  { label: 'Pendopo Lesehan Modern', sub: 'Kenyamanan lesehan kayu jati & sentuhan batik kontemporer', src: '/img/suasana-lesehan.jpg', emoji: '🪵', bg: '#FDE7C8', big: true },
  { label: 'Bar Kopi Nusantara', sub: 'Eksplorasi biji kopi lokal dengan interior kayu jati estetik', src: '/img/suasana-bar.jpg', emoji: '☕', bg: '#EAD7C3' },
  { label: 'Teras Tropis Asri', sub: 'Kesejukan udara terbuka dinaungi tanaman hijau rimbun', src: '/img/suasana-teras.jpg', emoji: '🌿', bg: '#DCE8C6' },
  { label: 'Ruang Utama Joglo Modern', sub: 'Kemegahan arsitektur kayu jati berpadu desain masa kini', src: '/img/about.jpg', emoji: '🏡', bg: '#FFE9A8' },
  { label: 'Pendar Malam Syahdu', sub: 'Suasana santap malam hangat diterangi temaram lentera', src: '/img/suasana-malam.jpg', emoji: '🏮', bg: '#FFD9C4' },
]

function Tile({ t }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure
      className="group relative h-full overflow-hidden rounded-[2rem] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-14px_rgba(15,56,112,0.3)] sheen-wrapper"
      style={{ background: t.bg }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <span role="img" aria-label={t.label} className={t.big ? 'text-[9rem]' : 'text-7xl'}>
            {t.emoji}
          </span>
        </div>
      ) : (
        <img
          src={t.src}
          alt={t.label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
      <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl glass-card p-3.5 shadow-card backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 sm:p-4 z-20 border border-white/60">
        <p className="font-display text-base font-bold text-navy md:text-lg">{t.label}</p>
        <p className="text-xs text-navy/70 line-clamp-1">{t.sub}</p>
      </figcaption>
    </figure>
  )
}

export default function Suasana() {
  return (
    <section id="suasana" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Galeri Ruang
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Suasana <span className="scribble italic">khas Nusantara</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-navy-dark/75">
          Sentuhan kayu jati, anyaman bambu, tanaman tropis yang asri, serta alunan musik akustik menghadirkan kehangatan rumah di setiap suapan.
        </p>
      </Reveal>

      {/* Mosaik: 1 foto besar di kiri (2x2), 4 foto kecil di kanan */}
      <div className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[14rem] md:auto-rows-[17rem] md:grid-cols-4 md:gap-5">
        {tiles.map((t, i) => (
          <Reveal
            key={t.label}
            delay={i * 90}
            className={`h-full ${t.big ? 'col-span-2 row-span-2' : ''}`}
          >
            <Tile t={t} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
