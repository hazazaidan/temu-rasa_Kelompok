import { ChefHat, Award, Star } from 'lucide-react'
import Reveal from './Reveal'

const chefs = [
  {
    name: 'Chef Budi Santoso',
    role: 'Executive Head Chef',
    desc: 'Pengalaman 12+ tahun meramu bumbu rendang Minang dan masakan tradisional nusantara berstandar hotel bintang 5.',
    image: '/img/chef1.jpg',
    specialty: 'Spesialis Rendang & Masakan Berbumbu',
  },
  {
    name: 'Chef Siti Rahmawati',
    role: 'Pastry & Dessert Chef',
    desc: 'Ahli mengolah aneka kudapan tradisional seperti mendoan hangat dan pisang keju aren dengan sentuhan krispi modern.',
    image: '/img/chef2.jpg',
    specialty: 'Spesialis Camilan & Jajanan Pasar',
  },
  {
    name: 'Arya Pratama',
    role: 'Head Barista & Mixologist',
    desc: 'Mengeksplorasi biji kopi lokal nusantara serta racikan minuman segar seperti es kopi gula aren dan cendol nangka.',
    image: '/img/barista.jpg',
    specialty: 'Spesialis Kopi & Minuman Segar',
  },
]

export default function TimChef() {
  return (
    <section id="tim-kuliner" className="container-page scroll-mt-24 py-12 md:py-20">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Dapur Temu Rasa
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Diramu oleh <span className="scribble italic">Juru Masak</span> Berpengalaman
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-navy-dark/75 sm:text-base">
          Setiap menu diracik dengan standar rasa yang konsisten oleh tim juru masak dan barista berdedikasi tinggi.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {chefs.map((c, i) => (
          <Reveal key={c.name} delay={i * 120} className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_-14px_rgba(15,56,112,0.3)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-extrabold text-navy shadow-sm backdrop-blur-sm">
                  {c.specialty}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-widest text-sun-deep">
                  {c.role}
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-bold text-navy">
                  {c.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-dark/70">
                  {c.desc}
                </p>
                
                <div className="mt-auto pt-5 flex items-center gap-1 text-xs font-bold text-navy/60 border-t border-navy/10">
                  <Star size={14} className="fill-sun text-sun" />
                  <span>Jaminan Rasa Otentik & Higienis</span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
