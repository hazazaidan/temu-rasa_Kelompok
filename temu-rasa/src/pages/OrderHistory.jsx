import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  PackageSearch,
  User,
  Printer,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  X,
  Sparkles,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { rupiah } from '../data/products'
import Button from '../components/Button'
import WhatsAppIcon from '../components/WhatsAppIcon'

const tabs = ['Semua', 'Diproses', 'Dikirim', 'Selesai']
const badge = {
  Diproses: 'bg-amber-100 text-amber-900 border border-amber-300',
  Dikirim: 'bg-blue-100 text-blue-900 border border-blue-300',
  Selesai: 'bg-green-100 text-green-900 border border-green-300',
}
const dot = { Diproses: 'bg-amber-500', Dikirim: 'bg-blue-500', Selesai: 'bg-green-500' }

// Tahapan status pesanan
const TRACK_STAGES = [
  { id: 'diterima', label: 'Pesanan Diterima', desc: 'Pesanan telah masuk ke sistem', icon: Clock },
  { id: 'dimasak', label: 'Dapur Menyiapkan', desc: 'Rempah diramu oleh juru masak', icon: ChefHat },
  { id: 'dikirim', label: 'Kurir Menuju Alamat', desc: 'Makanan hangat dalam perjalanan', icon: Bike },
  { id: 'selesai', label: 'Pesanan Selesai', desc: 'Pesanan telah sampai & dinikmati', icon: CheckCircle2 },
]

function getStageIndex(status) {
  if (status === 'Selesai') return 3
  if (status === 'Dikirim') return 2
  return 1 // 'Diproses'
}

export default function OrderHistory() {
  const { orders, updateOrderStatus, deleteOrder } = useCart()
  const { user, openModal } = useAuth()
  const [tab, setTab] = useState('Semua')
  const [open, setOpen] = useState(null)
  const [receiptOrder, setReceiptOrder] = useState(null)

  // Jika user belum login, tampilkan layar masuk akun
  if (!user) {
    return (
      <div className="container-page max-w-2xl py-12 md:py-20">
        <div className="mx-auto flex flex-col items-center rounded-[2.5rem] border border-navy/10 bg-white/95 p-8 text-center shadow-card sm:p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sun-soft">
            <PackageSearch size={38} className="text-navy" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-black text-navy sm:text-4xl">
            Pesanan Saya
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-dark/70 sm:text-base">
            Riwayat pesanan tersimpan rapi khusus untuk akun masing-masing. Silakan masuk terlebih dahulu untuk melihat dan melacak status pesanan Anda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              variant="accent"
              size="lg"
              onClick={() => openModal('login')}
              className="gap-2"
            >
              <User size={16} /> Masuk Akun
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => openModal('register')}
            >
              Daftar Akun Baru
            </Button>
          </div>
          <div className="mt-6 border-t border-navy/10 pt-4 w-full">
            <Link to="/menu" className="text-xs font-bold text-navy/60 hover:text-navy underline">
              Jelajahi Menu Temu Rasa
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const list = orders.filter((o) => tab === 'Semua' || o.status === tab)

  const nextStatusMap = {
    Diproses: 'Dikirim',
    Dikirim: 'Selesai',
    Selesai: 'Diproses',
  }

  const handleSimulateStatus = (orderId, currentStatus) => {
    const next = nextStatusMap[currentStatus] || 'Diproses'
    if (updateOrderStatus) {
      updateOrderStatus(orderId, next)
    }
  }

  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="title-display text-4xl sm:text-6xl">Pesanan Saya</h1>
          <p className="mt-2 font-script text-2xl font-bold text-navy-light">
            Halo, {user.name}!
          </p>
          <p className="mt-1 text-xs font-semibold text-navy/60">
            Terhubung sebagai: <b>{user.name}</b> ({user.phone || user.email})
          </p>
        </div>
        <Button to="/menu" variant="outline" size="sm">
          + Pesan Menu Baru
        </Button>
      </div>

      {/* Tabs Filter */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
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

      {/* Daftar Pesanan */}
      <ul className="mt-7 space-y-5">
        {list.length === 0 && (
          <li className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-navy/20 bg-white/60 p-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sun-soft">
              <PackageSearch size={30} className="text-navy" />
            </span>
            <h2 className="font-display text-xl font-black text-navy">
              {tab === 'Semua' ? 'Belum Ada Pesanan' : `Belum Ada Pesanan "${tab}"`}
            </h2>
            <p className="max-w-md text-sm font-semibold text-navy/60">
              {tab === 'Semua'
                ? `Hai ${user.name}, kamu belum memiliki riwayat pesanan di akun ini. Yuk pilih menu favoritmu sekarang!`
                : `Belum ada pesanan dengan status "${tab}" untuk akun ini.`}
            </p>
            {tab === 'Semua' ? (
              <Button to="/menu" variant="accent" size="sm" className="mt-2">
                Pesan Menu Sekarang
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setTab('Semua')} className="mt-2">
                Lihat Semua Pesanan
              </Button>
            )}
          </li>
        )}

        {list.map((o) => {
          const currentStage = getStageIndex(o.status)
          const isOpen = open === o.id

          return (
            <li key={o.id} className="relative overflow-hidden rounded-[2rem] bg-white shadow-card border border-navy/10">
              {/* Garis status kiri */}
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-2 ${dot[o.status] || 'bg-navy/20'}`} />

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-5 pl-7 sm:p-6 sm:pl-8">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-xl font-black text-navy sm:text-2xl">#{o.id}</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${badge[o.status] || 'bg-navy/10 text-navy'}`}>
                      <span className={`h-2 w-2 rounded-full ${dot[o.status] || 'bg-navy/30'} animate-pulse`} />
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-navy/55">{o.date}</p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-lg font-black text-navy sm:text-xl">{rupiah(o.total)}</p>
                  <button
                    onClick={() => setOpen(isOpen ? null : o.id)}
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-cream/50 px-3.5 py-1.5 text-xs font-bold text-navy transition hover:bg-navy/5"
                  >
                    {isOpen ? 'Tutup' : 'Lacak Status'}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Rincian Terbuka & Live Tracker */}
              {isOpen && (
                <div className="border-t border-navy/10 bg-cream/30 p-5 pl-7 sm:p-6 sm:pl-8 space-y-5">
                  {/* LIVE ORDER TRACKER */}
                  <div className="rounded-2xl bg-white p-5 shadow-sm border border-navy/10">
                    <div className="flex items-center justify-between pb-3 border-b border-navy/10">
                      <p className="font-display text-sm font-bold text-navy">
                        📍 Status Pengiriman Terkini
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSimulateStatus(o.id, o.status)}
                        className="inline-flex items-center gap-1 rounded-full bg-sun/20 px-2.5 py-1 text-[11px] font-bold text-navy transition hover:bg-sun"
                        title="Klik untuk mengubah status pesanan demo"
                      >
                        <Sparkles size={12} className="text-sun-deep" /> Simulasi Status
                      </button>
                    </div>

                    {/* Timeline Bar */}
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {TRACK_STAGES.map((st, idx) => {
                        const Icon = st.icon
                        const isDone = idx <= currentStage
                        const isCurrent = idx === currentStage

                        return (
                          <div
                            key={st.id}
                            className={`flex flex-col items-center text-center p-2.5 rounded-xl transition-all ${
                              isCurrent
                                ? 'bg-sun-soft/80 ring-2 ring-sun'
                                : isDone
                                ? 'bg-green-50/70 text-green-900'
                                : 'opacity-40'
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                isDone
                                  ? 'bg-navy text-sun shadow-sm'
                                  : 'bg-navy/10 text-navy/40'
                              }`}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="mt-2 text-xs font-bold leading-tight text-navy">
                              {st.label}
                            </span>
                            <span className="mt-0.5 text-[10px] text-navy/60 leading-tight">
                              {st.desc}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Menu yang Dipesan */}
                  <div className="rounded-2xl bg-white p-4 shadow-sm border border-navy/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy/55 mb-2">
                      Menu yang Dipesan
                    </p>
                    <ul className="space-y-1.5 text-xs font-semibold text-navy-dark">
                      {o.items.map((it, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-sun" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Informasi Alamat Pemesan jika ada */}
                  {o.customer?.nama && (
                    <div className="rounded-2xl bg-sun-soft/60 p-4 text-xs leading-relaxed text-navy-dark">
                      <p><b>Penerima:</b> {o.customer.nama} ({o.customer.hp})</p>
                      <p><b>Alamat:</b> {o.customer.alamat}</p>
                      <p><b>Pengiriman:</b> {o.customer.pengiriman}</p>
                      <p><b>Pembayaran:</b> {o.customer.pembayaran}</p>
                    </div>
                  )}

                  {/* Tombol Aksi: Cetak Struk, WA & Hapus */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      onClick={() => setReceiptOrder(o)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm transition hover:bg-navy/5"
                    >
                      <Printer size={14} /> Cetak Struk Digital
                    </button>

                    <a
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                        `Halo Temu Rasa, saya ingin menanyakan status pesanan #${o.id}. Terima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
                    >
                      <WhatsAppIcon size={15} /> Hubungi via WhatsApp
                    </a>

                    {deleteOrder && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus pesanan #${o.id} dari riwayat akun Anda?`)) {
                            deleteOrder(o.id)
                            toast.success(`Pesanan #${o.id} dihapus dari riwayat`)
                          }
                        }}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-chili shadow-sm transition hover:bg-chili hover:text-white"
                        title="Hapus dari riwayat pesanan saya"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* MODAL CETAK NOTA DIGITAL */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-navy-dark/60 backdrop-blur-sm"
            onClick={() => setReceiptOrder(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-left shadow-2xl print:p-0">
            <button
              onClick={() => setReceiptOrder(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-navy/40 hover:bg-navy/5 print:hidden"
            >
              <X size={20} />
            </button>

            <div className="border-b-2 border-dashed border-navy/20 pb-4 text-center">
              <span className="font-display text-2xl font-black text-navy">Temu Rasa</span>
              <p className="text-xs text-navy/60">Resto & Katering Nusantara Official</p>
              <p className="text-xs text-navy/60">Layanan Konsumen: 0812-3456-7890</p>
            </div>

            <div className="my-3 space-y-1 text-xs text-navy-dark">
              <div className="flex justify-between">
                <span>No. Order:</span>
                <span className="font-mono font-bold">#{receiptOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{receiptOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-navy">{receiptOrder.status}</span>
              </div>
              {receiptOrder.customer?.nama && (
                <div className="flex justify-between">
                  <span>Penerima:</span>
                  <span className="font-bold">{receiptOrder.customer.nama}</span>
                </div>
              )}
            </div>

            <div className="border-t border-b border-dashed border-navy/20 py-3 text-xs">
              {receiptOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between py-0.5">
                  <span>{it}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between font-extrabold text-navy text-sm pt-2">
                <span>TOTAL:</span>
                <span>{rupiah(receiptOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-navy py-2.5 text-center text-xs font-bold text-white transition hover:bg-navy-dark"
              >
                Cetak / Download PDF
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="rounded-full border border-navy/20 px-4 py-2.5 text-xs font-bold text-navy"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
