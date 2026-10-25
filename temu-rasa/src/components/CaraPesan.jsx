import { Utensils, ClipboardEdit, CreditCard, Bike, ArrowRight } from 'lucide-react'
import Button from './Button'
import Reveal from './Reveal'

const steps = [
  {
    num: '01',
    icon: Utensils,
    title: 'Pilih Menu Favorit',
    desc: 'Jelajahi menu lezat kami mulai dari makanan berat, kopi kekinian, hingga camilan renyah.',
  },
  {
    num: '02',
    icon: ClipboardEdit,
    title: 'Atur Porsi & Alamat',
    desc: 'Tentukan varian rasa, jumlah pesanan, dan isi detail alamat pengiriman kamu dengan lengkap.',
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Bayar dengan Mudah',
    desc: 'Gunakan metode pembayaran yang fleksibel: Transfer Bank, E-Wallet, atau bayar di tempat (COD).',
  },
  {
    num: '04',
    icon: Bike,
    title: 'Diantar Hangat',
    desc: 'Duduk santai di rumah, pesananmu disiapkan higienis dan diantar cepat dalam 25–45 menit.',
  },
]

export default function CaraPesan() {
  return (
    <section id="cara-pesan" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Alur Pemesanan
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Cara pesan <span className="scribble italic">mudah & cepat</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-navy-dark/70">
          Nikmati santapan favoritmu dalam empat langkah sederhana tanpa perlu keluar rumah.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <Reveal key={s.num} delay={i * 100} className="h-full">
              <div className="group relative flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_-14px_rgba(15,56,112,0.32)]">
                <span className="font-display text-4xl font-black text-sun/40 transition-colors duration-300 group-hover:text-sun">
                  {s.num}
                </span>
                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sun-soft text-navy transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-dark/70">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={450} className="mt-10 text-center">
        <Button to="/menu" variant="accent" size="lg">
          Pesan Sekarang <ArrowRight size={18} />
        </Button>
      </Reveal>
    </section>
  )
}