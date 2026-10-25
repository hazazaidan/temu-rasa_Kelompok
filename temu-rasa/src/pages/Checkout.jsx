import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  Loader2,
  Tag,
  Printer,
  MessageCircle,
  Lock,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { rupiah } from '../data/products'
import Button from '../components/Button'
import WhatsAppIcon from '../components/WhatsAppIcon'

const steps = ['Alamat', 'Pembayaran', 'Konfirmasi']
const shipping = {
  reg: { label: 'Regular (30–45 menit)', fee: 8000 },
  exp: { label: 'Express (15–25 menit)', fee: 15000 },
}
const payments = {
  bank: 'Transfer Bank (BCA, BNI, BRI, Mandiri)',
  ewallet: 'E-Wallet (OVO, GoPay, DANA, ShopeePay)',
  cod: 'COD (Bayar di Tempat)',
}

// Daftar kupon promo aktif
const PROMO_CODES = {
  TEMURASA20: { code: 'TEMURASA20', type: 'percent', value: 20, label: 'Diskon 20% Seluruh Menu' },
  DISKON10: { code: 'DISKON10', type: 'percent', value: 10, label: 'Diskon 10% Seluruh Menu' },
  GRATISONGKIR: { code: 'GRATISONGKIR', type: 'shipping', value: 100, label: 'Gratis Biaya Ongkir' },
}

const ORDER_URL = import.meta.env.VITE_ORDER_URL
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function sendOrder(payload) {
  if (!ORDER_URL) {
    await wait(800)
    return
  }
  const res = await fetch(ORDER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

function Radio({ checked, onChange, title, sub, right }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors ${
        checked ? 'border-navy bg-sun-soft' : 'border-navy/10 bg-white hover:border-navy/30'
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-sun ${
          checked ? 'border-navy bg-navy' : 'border-navy/30 bg-white'
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-sun" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-navy-dark">{title}</span>
        {sub && <span className="text-xs text-navy/60">{sub}</span>}
      </span>
      {right && <span className="text-sm font-extrabold text-navy">{right}</span>}
    </label>
  )
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-navy-dark">
        {label}
      </label>
      {children}
      {error && <p role="alert" className="mt-1.5 text-xs font-semibold text-chili">{error}</p>}
    </div>
  )
}

const cleanPhone = (v) => v.replace(/[\s-]/g, '')
function validate(form) {
  const e = {}
  if (form.nama.trim().length < 2) e.nama = 'Nama minimal 2 huruf'
  if (!/^(\+62|62|0)8\d{8,11}$/.test(cleanPhone(form.hp)))
    e.hp = 'Nomor HP tidak valid, contoh: 081234567890'
  if (form.alamat.trim().length < 8) e.alamat = 'Alamat minimal 8 karakter'
  return e
}

export default function Checkout() {
  const { items, subtotal, placeOrder } = useCart()
  const { user, openModal, login } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => ({
    nama: user?.name || '',
    hp: user?.phone || '',
    alamat: '',
  }))
  const [errors, setErrors] = useState({})
  const [ship, setShip] = useState('reg')
  const [pay, setPay] = useState('bank')
  const [done, setDone] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Kupon Promo State
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  const fee = shipping[ship].fee

  // Perhitungan Diskon
  let discountAmount = 0
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100)
    } else if (appliedPromo.type === 'shipping') {
      discountAmount = fee
    }
  }
  const total = Math.max(0, subtotal + fee - discountAmount)

  const handleApplyPromo = (codeToApply) => {
    const raw = (codeToApply || promoInput).trim().toUpperCase()
    if (!raw) {
      toast.error('Masukkan kode promo terlebih dahulu')
      return
    }
    const found = PROMO_CODES[raw]
    if (found) {
      setAppliedPromo(found)
      setPromoInput(found.code)
      toast.success(`Kupon ${found.code} berhasil dipasang!`, { icon: '🎉' })
    } else {
      toast.error('Kode promo tidak valid atau telah kedaluwarsa')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    toast('Kupon promo dicopot')
  }

  const set = (k) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [k]: value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  // Jika pengunjung belum login: Tampilkan Login Gate
  if (!user) {
    return (
      <div className="container-page max-w-lg py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sun text-navy shadow-card">
          <Lock size={36} />
        </div>
        <h1 className="title-display mt-6 text-4xl sm:text-5xl">Masuk untuk Checkout</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy-dark/75 sm:text-base">
          Untuk memastikan pengiriman makanan tersimpan di riwayat akunmu, silakan masuk terlebih dahulu.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="accent" size="lg" onClick={() => openModal('login')}>
            Masuk / Buat Akun
          </Button>
          <button
            type="button"
            onClick={() => {
              login({
                name: 'Budi Santoso',
                email: 'budi.santoso@gmail.com',
                phone: '081298765432',
              })
              setForm({
                nama: 'Budi Santoso',
                hp: '081298765432',
                alamat: '',
              })
            }}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-sun bg-sun/10 px-6 py-3 text-sm font-bold text-navy transition hover:bg-sun/20"
          >
            <Sparkles size={16} className="text-sun" /> Masuk Cepat Akun Demo
          </button>
        </div>
      </div>
    )
  }

  // Jika pesanan selesai (Success Screen)
  if (done) {
    const waText = encodeURIComponent(
      `Halo Temu Rasa, saya ingin konfirmasi pesanan baru:\n\n` +
        `🧾 *No. Pesanan:* #${done.id}\n` +
        `👤 *Nama:* ${done.customer.nama}\n` +
        `📱 *No. HP:* ${done.customer.hp}\n` +
        `📍 *Alamat:* ${done.customer.alamat}\n` +
        `🚚 *Layanan:* ${done.customer.pengiriman}\n` +
        `💳 *Pembayaran:* ${done.customer.pembayaran}\n\n` +
        `📋 *Rincian Pesanan:*\n` +
        done.items.map((it) => `• ${it}`).join('\n') +
        `\n\n💰 *Total Pembayaran:* ${rupiah(done.total)}\n\n` +
        `Mohon segera diproses ya, terima kasih!`
    )
    const waUrl = `https://wa.me/6281234567890?text=${waText}`

    return (
      <div className="container-page max-w-xl py-14 sm:py-20 text-center">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sun shadow-sun sm:h-28 sm:w-28">
          <CheckCircle2 size={60} className="text-navy-dark" />
        </span>
        <h1 className="title-display mt-6 text-4xl sm:text-5xl">Pesanan Berhasil!</h1>
        <p className="mt-3 text-sm text-navy-dark/75 sm:text-base">
          Nomor pesanan: <b className="text-navy font-mono text-lg">#{done.id}</b>. Total{' '}
          <b className="text-navy">{rupiah(done.total)}</b>.
        </p>

        {/* Ringkasan Cepat */}
        <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-card border border-navy/10 text-xs sm:text-sm space-y-1.5">
          <p><b>Penerima:</b> {done.customer.nama} ({done.customer.hp})</p>
          <p><b>Alamat:</b> {done.customer.alamat}</p>
          <p><b>Pengiriman:</b> {done.customer.pengiriman}</p>
          <p><b>Pembayaran:</b> {done.customer.pembayaran}</p>
          <div className="pt-2 border-t border-navy/10">
            <b>Menu dipesan:</b>
            <ul className="mt-1 list-disc pl-5 text-navy-dark/80">
              {done.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-card transition-all hover:bg-green-700 hover:shadow-card-hover"
          >
            <WhatsAppIcon size={19} /> Konfirmasi ke WhatsApp
          </a>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy bg-white px-6 py-3.5 text-sm font-bold text-navy shadow-sm transition hover:bg-navy/5"
          >
            <Printer size={18} /> Cetak Struk Digital
          </button>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/pesanan" variant="accent" size="md">
            Pantau di Riwayat Pesanan
          </Button>
          <Button to="/menu" variant="outline" size="md">
            Pesan Lagi
          </Button>
        </div>

        {/* Modal Nota Digital */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-navy-dark/60 backdrop-blur-sm"
              onClick={() => setShowInvoiceModal(false)}
            />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-left shadow-2xl print:p-0">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-navy/40 hover:bg-navy/5 print:hidden"
              >
                <X size={20} />
              </button>

              <div className="border-b-2 border-dashed border-navy/20 pb-4 text-center">
                <span className="font-display text-2xl font-black text-navy">Temu Rasa</span>
                <p className="text-xs text-navy/60">Jl. Ir. H. Juanda No. 12, Dago, Bandung</p>
                <p className="text-xs text-navy/60">Telp: 0812-3456-7890</p>
              </div>

              <div className="my-3 space-y-1 text-xs text-navy-dark">
                <div className="flex justify-between">
                  <span>No. Order:</span>
                  <span className="font-mono font-bold">#{done.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{done.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold">{done.customer.nama}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-navy/20 py-3 text-xs">
                {done.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-0.5">
                    <span>{it}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-navy/70">
                  <span>Metode:</span>
                  <span>{done.customer.pembayaran}</span>
                </div>
                <div className="flex justify-between font-extrabold text-navy text-sm pt-2 border-t border-navy/10">
                  <span>TOTAL BAYAR:</span>
                  <span>{rupiah(done.total)}</span>
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
                  onClick={() => setShowInvoiceModal(false)}
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

  // Jika keranjang kosong
  if (items.length === 0) {
    return (
      <div className="container-page max-w-md py-24 text-center">
        <h1 className="font-display text-3xl font-black text-navy">Keranjang Kosong</h1>
        <p className="mt-2 text-navy-dark/60">Pilih menu favoritmu dulu sebelum checkout.</p>
        <Button to="/menu" variant="accent" className="mt-6">
          Lihat Menu
        </Button>
      </div>
    )
  }

  const next = () => {
    if (step === 0) {
      const e = validate(form)
      setErrors(e)
      if (Object.keys(e).length) {
        toast.error('Periksa kembali kolom alamat dan telepon')
        return
      }
    }
    setStep(step + 1)
  }

  const submitOrder = async () => {
    if (submitting) return

    const e = validate(form)
    if (Object.keys(e).length) {
      setErrors(e)
      setStep(0)
      toast.error('Periksa kembali data pengirimanmu')
      return
    }

    setSubmitting(true)
    try {
      const customer = {
        nama: form.nama.trim(),
        hp: cleanPhone(form.hp),
        alamat: form.alamat.trim(),
        pengiriman: shipping[ship].label,
        pembayaran: payments[pay],
        email: user?.email || '',
        userId: user?.email || user?.phone || cleanPhone(form.hp),
      }
      await sendOrder({
        customer,
        items: items.map((i) => ({
          nama: i.product.name,
          varian: i.variant,
          qty: i.qty,
          harga: i.product.price,
        })),
        promo: appliedPromo ? appliedPromo.code : null,
        total,
      })
      const order = placeOrder(total, customer)
      setDone(order)
      toast.success(`Pesanan #${order.id} berhasil dicatat!`)
    } catch {
      toast.error('Gagal mengirim pesanan. Silakan coba sesaat lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldCls = (k) => `input ${errors[k] ? '!border-chili !ring-chili/20' : ''}`

  return (
    <div className="container-page max-w-5xl py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="title-display text-5xl">Checkout</h1>
          <p className="mt-1 text-xs text-navy/60">
            Masuk sebagai: <b>{user.name}</b> ({user.phone || user.email})
          </p>
        </div>
      </div>

      {/* Stepper Langkah Checkout */}
      <ol className="mt-8 flex items-center gap-2 text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2" aria-current={i === step ? 'step' : undefined}>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors ${
                i < step
                  ? 'bg-navy text-white'
                  : i === step
                  ? 'bg-sun text-navy-dark shadow-sun'
                  : 'border-2 border-navy/20 text-navy/50'
              }`}
            >
              {i < step ? <Check size={16} strokeWidth={3} /> : i + 1}
            </span>
            <span className={`hidden sm:inline ${i === step ? 'font-extrabold text-navy' : 'font-semibold text-navy/55'}`}>
              {s}
            </span>
            {i < 2 && <span className={`h-0.5 flex-1 rounded-full ${i < step ? 'bg-navy' : 'bg-navy/15'}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_360px] md:gap-8">
        {/* Kolom Formulir Utama */}
        <section className="space-y-4 rounded-[2rem] bg-white p-6 shadow-card md:p-8">
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl font-black text-navy">Alamat & Pengiriman</h2>
              {[
                ['nama', 'Nama penerima', 'name', 'text'],
                ['hp', 'Nomor HP / WhatsApp', 'tel', 'tel'],
              ].map(([k, l, ac, mode]) => (
                <Field key={k} label={l} htmlFor={`f-${k}`} error={errors[k]}>
                  <input
                    id={`f-${k}`}
                    className={fieldCls(k)}
                    placeholder={l}
                    value={form[k]}
                    onChange={set(k)}
                    autoComplete={ac}
                    inputMode={mode === 'tel' ? 'tel' : undefined}
                    maxLength={k === 'nama' ? 60 : 20}
                    aria-invalid={!!errors[k]}
                  />
                </Field>
              ))}

              <Field label="Alamat lengkap tujuan pengantaran" htmlFor="f-alamat" error={errors.alamat}>
                <textarea
                  id="f-alamat"
                  rows={3}
                  className={fieldCls('alamat')}
                  placeholder="Contoh: Jl. Dago No. 12, RT 02/04, Coblong (Patokan depan apotek)"
                  value={form.alamat}
                  onChange={set('alamat')}
                  autoComplete="street-address"
                  maxLength={250}
                  aria-invalid={!!errors.alamat}
                />
              </Field>

              <h2 className="pt-4 font-display text-2xl font-black text-navy">Pilihan Kurir Antar</h2>
              <div className="space-y-3">
                {Object.entries(shipping).map(([k, v]) => (
                  <Radio
                    key={k}
                    checked={ship === k}
                    onChange={() => setShip(k)}
                    title={v.label}
                    right={rupiah(v.fee)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-2xl font-black text-navy">Metode Pembayaran</h2>
              <div className="space-y-3">
                {Object.entries(payments).map(([k, v]) => (
                  <Radio key={k} checked={pay === k} onChange={() => setPay(k)} title={v} />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-2xl font-black text-navy">Konfirmasi Pesanan</h2>
              <div className="space-y-2 rounded-2xl bg-sun-soft p-4 text-sm leading-relaxed text-navy-dark">
                <p>
                  <b>Alamat:</b> {form.nama.trim()} ({cleanPhone(form.hp)}) — {form.alamat.trim()}
                </p>
                <p>
                  <b>Pengiriman:</b> {shipping[ship].label}
                </p>
                <p>
                  <b>Pembayaran:</b> {payments[pay]}
                </p>
                {appliedPromo && (
                  <p className="text-green-800 font-bold">
                    <b>Promo Dipakai:</b> {appliedPromo.code} ({appliedPromo.label})
                  </p>
                )}
              </div>
              <ul className="divide-y divide-navy/10 rounded-2xl border-2 border-navy/10 text-sm">
                {items.map((i) => (
                  <li key={i.key} className="flex justify-between gap-3 p-3.5">
                    <span>
                      {i.product.name} {i.variant && `(${i.variant})`} x{i.qty}
                    </span>
                    <span className="font-bold text-navy">{rupiah(i.product.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={submitting}>
                Kembali
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={next}>
                Lanjut ke {steps[step + 1]} <ArrowRight size={16} />
              </Button>
            ) : (
              <Button variant="accent" size="lg" onClick={submitOrder} disabled={submitting} aria-busy={submitting}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Memproses Pesanan...
                  </span>
                ) : (
                  'Konfirmasi & Buat Pesanan'
                )}
              </Button>
            )}
          </div>
        </section>

        {/* Kolom Ringkasan Belanja & Kupon Promo */}
        <aside className="space-y-4">
          <div className="rounded-[2rem] bg-navy p-6 text-sm text-white shadow-card">
            <h2 className="font-display text-2xl font-black italic">Ringkasan Belanja</h2>
            <div className="mt-4 flex justify-between text-white/80">
              <span>Subtotal Menu</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-white/80">
              <span>Ongkos Kirim</span>
              <span>{rupiah(fee)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="mt-2 flex justify-between font-bold text-sun">
                <span>Diskon Kupon</span>
                <span>-{rupiah(discountAmount)}</span>
              </div>
            )}

            <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
              <span className="font-bold">Total Pembayaran</span>
              <span className="text-2xl font-extrabold text-sun">{rupiah(total)}</span>
            </div>
          </div>

          {/* Box Kupon Promo */}
          <div className="rounded-[2rem] bg-white p-5 shadow-card border border-navy/10">
            <div className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <Tag size={18} className="text-sun" />
              <span>Punya Kupon Promo?</span>
            </div>

            {appliedPromo ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 p-3 border border-green-200">
                <div>
                  <p className="text-xs font-black text-green-900">{appliedPromo.code}</p>
                  <p className="text-[11px] text-green-700">{appliedPromo.label}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="rounded-lg p-1 text-chili hover:bg-red-50 text-xs font-bold"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="KODE PROMO"
                  className="input !text-xs !py-2 uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleApplyPromo()}
                  className="rounded-full bg-navy px-4 text-xs font-bold text-white transition hover:bg-navy-dark"
                >
                  Pakai
                </button>
              </div>
            )}

            {/* Rekomendasi Kupon Cepat */}
            <div className="mt-3 pt-3 border-t border-navy/10">
              <p className="text-[11px] font-semibold text-navy/55">Kupon yang tersedia:</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Object.values(PROMO_CODES).map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => handleApplyPromo(p.code)}
                    className="rounded-full bg-sun-soft px-2.5 py-1 text-[11px] font-bold text-navy transition hover:bg-sun"
                  >
                    🏷️ {p.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
