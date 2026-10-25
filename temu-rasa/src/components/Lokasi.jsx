import { ArrowUpRight, ShoppingBag, MapPin, Phone, Clock } from 'lucide-react'
import Button from './Button'
import Reveal from './Reveal'

export const outlets = [
  {
    id: 'dago',
    nama: 'Temu Rasa — Dago Asri (Pusat)',
    alamat: 'Jl. Ir. H. Juanda No. 12, Dago, Bandung',
    buka: '08.00',
    tutup: '22.00',
    telepon: '0812-3456-7890',
  },
]

const toMinutes = (t) => {
  const [h, m] = t.split('.').map(Number)
  return h * 60 + m
}

const isOpenNow = (buka, tutup) => {
  const d = new Date()
  const now = d.getHours() * 60 + d.getMinutes()
  return now >= toMinutes(buka) && now < toMinutes(tutup)
}

const mapEmbed = (alamat) => `https://www.google.com/maps?q=${encodeURIComponent(alamat)}&output=embed`
const mapLink = (alamat) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`

function Status({ open }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
        open ? 'bg-green-100 text-green-800' : 'bg-navy/10 text-navy/70'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? 'bg-green-500' : 'bg-navy/40'}`} />
      {open ? 'Buka sekarang' : 'Sedang tutup'}
    </span>
  )
}

export default function Lokasi() {
  const o = outlets[0]

  return (
    <section id="lokasi" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Lokasi Kami
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Kunjungi <span className="scribble italic">outlet kami</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-navy-dark/70">
          Mampir untuk makan di tempat yang asri, atau pesan antar langsung ke rumah.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
        {/* Outlet Utama dengan Peta */}
        <Reveal delay={100} className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
            <div className="relative aspect-[16/9] bg-navy/5 sm:aspect-[2/1]">
              <iframe
                title={`Peta outlet ${o.nama}`}
                src={mapEmbed(o.alamat)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
              <a
                href={mapLink(o.alamat)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-navy shadow-card backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
              >
                Buka di Google Maps <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-sun-soft px-3 py-1 text-xs font-extrabold text-navy">
                  Outlet Utama
                </span>
                <Status open={isOpenNow(o.buka, o.tutup)} />
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
                {o.nama}
              </h3>
              
              <div className="mt-3 space-y-2 text-sm text-navy-dark/75">
                <p className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-sun" />
                  <span>{o.alamat}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={18} className="shrink-0 text-sun" />
                  <span>Buka setiap hari: <b>{o.buka} – {o.tutup} WIB</b></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="shrink-0 text-sun" />
                  <span>WhatsApp / Telepon: <b>{o.telepon}</b></span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-4">
                <a
                  href={mapLink(o.alamat)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-navy underline underline-offset-4 transition-colors hover:text-navy-light"
                >
                  Petunjuk Arah Maps →
                </a>
                <Button to="/#reservasi" variant="outline" size="sm">
                  Reservasi Meja
                </Button>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Layanan Pesan Antar */}
        <Reveal delay={200} className="h-full">
          <article className="flex h-full flex-col justify-between rounded-[2rem] bg-navy p-7 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sun text-navy-dark shadow-sun">
                <ShoppingBag size={28} />
              </div>
              <h3 className="mt-6 font-display text-3xl font-black italic text-sun">
                Pesan Antar Kilat
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Lagi mager keluar? Tenang, santapan lezat khas Temu Rasa siap meluncur hangat langsung ke pintu rumahmu.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Ongkos Kirim</span>
                  <span className="font-extrabold text-sun">Mulai Rp8.000</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-white/70">Estimasi Tiba</span>
                  <span className="font-bold text-white">25–45 Menit</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-white/70">Jam Operasional</span>
                  <span className="font-bold text-white">08.00 – 22.00 WIB</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Button to="/menu" variant="accent" size="lg" className="w-full">
                Pesan Antar Sekarang
              </Button>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
