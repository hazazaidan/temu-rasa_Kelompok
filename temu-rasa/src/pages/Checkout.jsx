import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { rupiah } from '../data/products'
import Button from '../components/Button'

const steps = ['Alamat', 'Pembayaran', 'Konfirmasi']
const shipping = { reg: { label: 'Regular (30–45 menit)', fee: 8000 }, exp: { label: 'Express (15–25 menit)', fee: 15000 } }
const payments = { bank: 'Transfer Bank (BCA, BNI, BRI, Mandiri)', ewallet: 'E-Wallet (OVO, GoPay, DANA, ShopeePay)', cod: 'COD (Bayar di Tempat)' }

// Kartu pilihan (radio) yang jelas: lingkaran terisi + border navy saat dipilih
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

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-navy-dark">{label}</label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-chili">{error}</p>
      )}
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, placeOrder } = useCart()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ nama: '', hp: '', alamat: '' })
  const [errors, setErrors] = useState({})
  const [ship, setShip] = useState('reg')
  const [pay, setPay] = useState('bank')
  const [done, setDone] = useState(null)

  const fee = shipping[ship].fee
  const total = subtotal + fee
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (done) return (
    <div className="container-page max-w-md py-20 text-center">
      <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-sun shadow-sun">
        <CheckCircle2 size={64} className="text-navy-dark" />
      </span>
      <h1 className="title-display mt-6 text-5xl">Pesanan Berhasil!</h1>
      <p className="mt-3 text-navy-dark/70">Nomor pesanan <b>{done.id}</b>. Total {rupiah(done.total)}.</p>
      <p className="mt-2 font-script text-2xl font-bold text-navy-light">Makan enak, kemana aja!</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/pesanan">Lihat Pesanan</Button>
        <Button to="/menu" variant="outline">Pesan Lagi</Button>
      </div>
    </div>
  )
  if (items.length === 0) return (
    <div className="container-page max-w-md py-24 text-center">
      <h1 className="font-display text-3xl font-black text-navy">Keranjang kosong</h1>
      <p className="mt-2 text-navy-dark/60">Tambahkan menu dulu sebelum checkout.</p>
      <Button to="/menu" variant="accent" className="mt-6">Lihat Menu</Button>
    </div>
  )

  const next = () => {
    if (step === 0) {
      const e = {}
      if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
      if (!/^[0-9+]{9,15}$/.test(form.hp)) e.hp = 'Nomor HP tidak valid'
      if (form.alamat.trim().length < 10) e.alamat = 'Alamat minimal 10 karakter'
      setErrors(e)
      if (Object.keys(e).length) return
    }
    setStep(step + 1)
  }

  const fieldCls = (k) => `input ${errors[k] ? '!border-chili !ring-chili/20' : ''}`

  return (
    <div className="container-page max-w-5xl py-10 md:py-14">
      <h1 className="title-display text-5xl">Checkout</h1>

      {/* Stepper: ini memang urutan langkah, jadi pakai nomor */}
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
            <span className={`hidden sm:inline ${i === step ? 'font-extrabold text-navy' : 'font-semibold text-navy/55'}`}>{s}</span>
            {i < 2 && <span className={`h-0.5 flex-1 rounded-full ${i < step ? 'bg-navy' : 'bg-navy/15'}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_340px] md:gap-8">
        <section className="space-y-4 rounded-[2rem] bg-white p-6 shadow-card md:p-8">
          {step === 0 && (<>
            <h2 className="font-display text-2xl font-black text-navy">Alamat Pengiriman</h2>
            {[['nama', 'Nama penerima'], ['hp', 'Nomor HP / WhatsApp']].map(([k, l]) => (
              <Field key={k} label={l} error={errors[k]}>
                <input className={fieldCls(k)} placeholder={l} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
              </Field>
            ))}
            <Field label="Alamat lengkap" error={errors.alamat}>
              <textarea rows={3} className={fieldCls('alamat')} placeholder="Alamat lengkap" value={form.alamat} onChange={set('alamat')} aria-invalid={!!errors.alamat} />
            </Field>
            <h2 className="pt-4 font-display text-2xl font-black text-navy">Metode Pengiriman</h2>
            <div className="space-y-3">
              {Object.entries(shipping).map(([k, v]) => <Radio key={k} checked={ship === k} onChange={() => setShip(k)} title={v.label} right={rupiah(v.fee)} />)}
            </div>
          </>)}

          {step === 1 && (<>
            <h2 className="font-display text-2xl font-black text-navy">Metode Pembayaran</h2>
            <div className="space-y-3">
              {Object.entries(payments).map(([k, v]) => <Radio key={k} checked={pay === k} onChange={() => setPay(k)} title={v} />)}
            </div>
          </>)}

          {step === 2 && (<>
            <h2 className="font-display text-2xl font-black text-navy">Konfirmasi Pesanan</h2>
            <div className="space-y-2 rounded-2xl bg-sun-soft p-4 text-sm leading-relaxed text-navy-dark">
              <p><b>Alamat:</b> {form.nama} ({form.hp}) — {form.alamat}</p>
              <p><b>Pengiriman:</b> {shipping[ship].label}</p>
              <p><b>Pembayaran:</b> {payments[pay]}</p>
            </div>
            <ul className="divide-y divide-navy/10 rounded-2xl border-2 border-navy/10 text-sm">
              {items.map((i) => (
                <li key={i.key} className="flex justify-between gap-3 p-3.5">
                  <span>{i.product.name} {i.variant && `(${i.variant})`} x{i.qty}</span>
                  <span className="font-bold text-navy">{rupiah(i.product.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </>)}

          <div className="flex flex-wrap gap-3 pt-4">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Kembali</Button>}
            {step < 2
              ? <Button onClick={next}>Lanjut ke {steps[step + 1]}</Button>
              : <Button variant="accent" size="lg" onClick={() => setDone(placeOrder(total))}>Buat Pesanan</Button>}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-navy p-6 text-sm text-white shadow-card md:sticky md:top-24">
          <h2 className="font-display text-2xl font-black italic">Ringkasan Belanja</h2>
          <div className="mt-4 flex justify-between text-white/80"><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>
          <div className="mt-2 flex justify-between text-white/80"><span>Ongkir</span><span>{rupiah(fee)}</span></div>
          <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-extrabold text-sun">{rupiah(total)}</span>
          </div>
          <Link to="/menu" className="mt-5 block rounded-full py-2 text-center text-sm font-bold text-white/80 underline-offset-4 transition-colors hover:text-sun hover:underline">
            Tambah menu lain
          </Link>
        </aside>
      </div>
    </div>
  )
}