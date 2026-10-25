import { CheckCircle2, ArrowRight, Award } from 'lucide-react'
import Button from './Button'
import Reveal from './Reveal'

export default function TentangKami() {
  const points = [
    'Rempah alami asli nusantara tanpa bahan pengawet kimia',
    'Dapur higienis berstandar tinggi dengan jaminan 100% halal',
    'Suasana resto asri berkonsep kayu jati & taman tropis',
    'Layanan katering prasmanan & nasi kotak untuk segala acara',
  ]

  return (
    <section id="tentang-kami" className="container-page scroll-mt-24 py-12 md:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Kolom Foto Kiri dengan Badge Pengalaman */}
        <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative isolate overflow-hidden rounded-[2.5rem] shadow-card-hover sheen-wrapper">
            <img
              src="/img/about.jpg"
              alt="Suasana santap kuliner di Temu Rasa"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </div>

          {/* Floating Experience Badge ala CaterServ */}
          <div className="tr-anim-float absolute -bottom-6 -left-2 rounded-2xl glass-card p-4 shadow-card-hover sm:-bottom-8 sm:left-6 sm:p-5 border border-white/80">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sun text-navy-dark shadow-sun">
                <Award size={26} />
              </span>
              <div>
                <p className="font-display text-2xl font-black text-navy leading-none">5+ Tahun</p>
                <p className="text-xs font-semibold text-navy/70 mt-1">Dedikasi Rasa Nusantara</p>
              </div>
            </div>
          </div>

          {/* Floating Pill Kanan */}
          <div className="absolute -right-3 top-8 hidden rounded-full bg-navy px-4 py-2 text-xs font-bold text-sun shadow-card sm:block">
            ★ Kuliner Terfavorit Bandung
          </div>
        </Reveal>

        {/* Kolom Konten Kanan */}
        <Reveal delay={150}>
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
            <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
            Tentang Temu Rasa
          </p>
          <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-5xl leading-tight">
            Menghidupkan Kembali <span className="scribble italic">Kehangatan</span> Meja Makan Nusantara
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-dark/75">
            Temu Rasa hadir memadukan resep rempah legendaris dari berbagai penjuru Indonesia dengan suasana kafe modern yang asri dan bersahabat. Setiap hidangan diracik penuh cinta untuk menghadirkan cerita di setiap suapan.
          </p>

          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm font-semibold text-navy-dark/85">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sun fill-sun/20" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/menu" variant="accent" size="lg">
              Jelajahi Menu <ArrowRight size={18} />
            </Button>
            <Button to="/#reservasi" variant="outline" size="lg">
              Reservasi Meja
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
