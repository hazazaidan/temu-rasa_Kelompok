import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { rupiah } from '../data/products'

const tabs = ['Semua', 'Diproses', 'Dikirim', 'Selesai']
const badge = {
  Diproses: 'bg-sun-soft text-amber-800',
  Dikirim: 'bg-blue-100 text-blue-800',
  Selesai: 'bg-green-100 text-green-800',
}
// BARU: warna titik & garis kiri sesuai status (hanya tampilan)
const dot = { Diproses: 'bg-sun', Dikirim: 'bg-blue-500', Selesai: 'bg-green-500' }

export default function OrderHistory() {
  const { orders } = useCart()
  const [tab, setTab] = useState('Semua')
  const [open, setOpen] = useState(null)
  const list = orders.filter((o) => tab === 'Semua' || o.status === tab)

  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="title-display text-5xl sm:text-6xl">Pesanan Saya</h1>
      <p className="mt-3 font-script text-2xl font-bold text-navy-light">Makan enak, kemana aja!</p>

      <div className="mt-7 flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`pill ${tab === t ? 'pill-active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-7 space-y-4">
        {list.length === 0 && (
          <li className="rounded-[2rem] border-2 border-dashed border-navy/20 bg-white/60 p-12 text-center text-sm font-semibold text-navy/60">
            Belum ada pesanan dengan status ini.
          </li>
        )}
        {list.map((o) => (
          <li key={o.id} className="relative overflow-hidden rounded-3xl bg-white shadow-card">
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${dot[o.status] || 'bg-navy/20'}`} />
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-5 pl-7">
              <div>
                <p className="font-display text-xl font-black text-navy">#{o.id}</p>
                <p className="text-xs font-semibold text-navy/55">{o.date}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold ${badge[o.status]}`}>
                <span className={`h-2 w-2 rounded-full ${dot[o.status] || 'bg-navy/30'}`} />
                {o.status}
              </span>
              <p className="text-lg font-extrabold text-navy">{rupiah(o.total)}</p>
              <button
                onClick={() => setOpen(open === o.id ? null : o.id)}
                aria-expanded={open === o.id}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
              >
                {open === o.id ? 'Tutup' : 'Lihat Detail'}
                <ChevronDown size={16} className={`transition-transform ${open === o.id ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {open === o.id && (
              <ul className="mx-5 mb-5 ml-7 space-y-1.5 rounded-2xl bg-cream p-4 text-sm font-semibold text-navy-dark/80">
                {o.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                    {i}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}