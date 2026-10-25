import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from './Button'
import Reveal from './Reveal'
import { outlets } from './Lokasi'

// Opsional: isi VITE_RESERVATION_URL di .env.local (Formspree / MockAPI) supaya reservasi dikirim ke layanan.
// Kalau kosong, reservasi hanya disimpan di localStorage.
const RESERVATION_URL = import.meta.env.VITE_RESERVATION_URL
const STORAGE_KEY = 'temurasa-reservations'

// idx = nilai Date.getDay() (0 = Minggu)
const DAYS = [
  { nama: 'Senin', idx: 1 },
  { nama: 'Selasa', idx: 2 },
  { nama: 'Rabu', idx: 3 },
  { nama: 'Kamis', idx: 4 },
  { nama: 'Jumat', idx: 5 },
  { nama: 'Sabtu', idx: 6 },
  { nama: 'Minggu', idx: 0 },
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toMin = (t) => {
  const [h, m] = t.split('.').map(Number)
  return h * 60 + m
}
const cleanPhone = (v) => v.replace(/[\s-]/g, '')

const minDate = () => toISO(new Date())
const maxDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return toISO(d)
}

// Pilihan jam: tiap 1 jam, dari jam buka sampai 1 jam sebelum tutup.
// Kalau tanggalnya hari ini, jam yang sudah lewat (atau kurang dari 30 menit lagi) dibuang.
function slotsFor(outlet, dateISO) {
  if (!outlet) return []
  const now = new Date()
  const isToday = dateISO === toISO(now)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const out = []
  for (let m = toMin(outlet.buka); m <= toMin(outlet.tutup) - 60; m += 60) {
    if (isToday && m < nowMin + 30) continue
    out.push(`${pad(Math.floor(m / 60))}.${pad(m % 60)}`)
  }
  return out
}

// Urutan ini juga dipakai untuk memfokuskan kolom pertama yang salah
const FIELD_ORDER = ['nama', 'hp', 'outlet', 'tanggal', 'jam', 'jumlah']

function validate(f) {
  const e = {}
  const outlet = outlets.find((o) => o.id === f.outlet)

  if (f.nama.trim().length < 2) e.nama = 'Nama minimal 2 huruf'
  if (!/^(\+62|62|0)8\d{8,11}$/.test(cleanPhone(f.hp))) e.hp = 'Nomor HP tidak valid, contoh: 081234567890'
  if (!outlet) e.outlet = 'Pilih outlet'

  if (!f.tanggal) e.tanggal = 'Pilih tanggal'
  else if (f.tanggal < minDate()) e.tanggal = 'Tanggal sudah lewat'
  else if (f.tanggal > maxDate()) e.tanggal = 'Reservasi maksimal 60 hari ke depan'

  if (!f.jam) e.jam = 'Pilih jam'
  else if (outlet && !slotsFor(outlet, f.tanggal).includes(f.jam)) e.jam = 'Jam tidak tersedia, pilih jam lain'

  const n = Number(f.jumlah)
  if (!Number.isInteger(n) || n < 1 || n > 12) e.jumlah = 'Jumlah 1 sampai 12 orang'

  return e
}

async function sendReservation(payload) {
  if (!RESERVATION_URL) {
    await wait(900) // jeda singkat supaya state "Mengirim..." terlihat
    return
  }
  const res = await fetch(RESERVATION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

function saveReservation(r) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([r, ...(Array.isArray(list) ? list : [])]))
  } catch {
    /* abaikan: storage penuh atau diblokir */
  }
}

const formatTanggal = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function Field({ label, id, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy-dark">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-navy/55">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs font-semibold text-chili">{error}</p>
      )}
    </div>
  )
}

const emptyForm = () => ({
  nama: '',
  hp: '',
  outlet: outlets[0].id,
  tanggal: '',
  jam: '',
  jumlah: '2',
  catatan: '',
})

export default function Reservasi() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  const todayIdx = new Date().getDay()
  const outlet = outlets.find((o) => o.id === form.outlet)
  const slots = useMemo(() => slotsFor(outlet, form.tanggal), [outlet, form.tanggal])

  // ketik ulang = pesan error kolom itu hilang. Ganti outlet/tanggal = jam dipilih ulang.
  const set = (k) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [k]: value, ...(k === 'outlet' || k === 'tanggal' ? { jam: '' } : {}) }))
    setErrors((er) => ({ ...er, [k]: undefined, ...(k === 'outlet' || k === 'tanggal' ? { jam: undefined } : {}) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return // cegah klik ganda

    const errs = validate(form)
    setErrors(errs)
    const firstBad = FIELD_ORDER.find((k) => errs[k])
    if (firstBad) {
      toast.error('Periksa lagi data reservasi')
      document.getElementById(`rsv-${firstBad}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        id: `RSV-${Date.now().toString(36).toUpperCase().slice(-5)}`,
        nama: form.nama.trim(),
        hp: cleanPhone(form.hp),
        outlet: outlet.nama,
        tanggal: form.tanggal,
        jam: form.jam,
        jumlah: Number(form.jumlah),
        catatan: form.catatan.trim(),
        dibuat: new Date().toISOString(),
      }
      await sendReservation(payload)
      saveReservation(payload)
      setDone(payload)
      setForm(emptyForm())
      toast.success('Reservasi berhasil dicatat!')
    } catch {
      toast.error('Reservasi gagal dikirim. Coba lagi sebentar lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const cls = (k) => `input !bg-cream ${errors[k] ? '!border-chili !ring-chili/20' : ''}`
  const a11y = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `rsv-${k}-err` : undefined })

  return (
    <section id="reservasi" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Jam Buka & Reservasi
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Siapkan <span className="scribble italic">mejamu</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-navy-dark/75">
          Pesan meja santap langsung di outlet Dago Bandung lewat formulir di bawah.
        </p>
      </Reveal>

      <div className="mt-12 grid items-start gap-6 md:grid-cols-2 md:gap-8">
        {/* Jam buka */}
        <Reveal>
          <div className="rounded-[2rem] bg-white p-6 shadow-card md:p-9">
            <h3 className="font-display text-3xl font-bold text-navy">Jam buka</h3>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="text-navy/60">
                  <th className="px-3 pb-3 font-semibold">Hari</th>
                  {outlets.map((o) => (
                    <th key={o.id} className="px-3 pb-3 font-semibold">{o.nama}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((d) => {
                  const isToday = d.idx === todayIdx
                  return (
                    <tr
                      key={d.nama}
                      className={
                        isToday
                          ? 'bg-sun font-extrabold text-navy-dark [&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl'
                          : 'border-t border-navy/10 text-navy-dark/80'
                      }
                    >
                      <td className="px-3 py-3.5">
                        {d.nama}
                        {isToday && ' (hari ini)'}
                      </td>
                      {outlets.map((o) => (
                        <td key={o.id} className="px-3 py-3.5">
                          {o.buka}–{o.tutup}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Form reservasi */}
        <Reveal delay={120}>
          <div className="rounded-[2rem] bg-white p-6 shadow-card md:p-9">
            <h3 className="font-display text-3xl font-bold text-navy">Reservasi meja</h3>

            {done ? (
              <div className="mt-6 text-center" role="status">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sun shadow-sun">
                  <CheckCircle2 size={44} className="text-navy-dark" />
                </span>
                <p className="mt-4 font-display text-2xl font-black text-navy">Meja kamu sudah dicatat!</p>
                <dl className="mt-5 space-y-2 rounded-2xl bg-sun-soft p-4 text-left text-sm text-navy-dark">
                  <div className="flex justify-between gap-3"><dt className="font-bold">Kode</dt><dd>{done.id}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="font-bold">Atas nama</dt><dd>{done.nama}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="font-bold">Outlet</dt><dd>{done.outlet}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="font-bold">Waktu</dt><dd className="text-right">{formatTanggal(done.tanggal)}, {done.jam}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="font-bold">Jumlah</dt><dd>{done.jumlah} orang</dd></div>
                </dl>
                <Button variant="outline" className="mt-6" onClick={() => setDone(null)}>
                  Buat reservasi lain
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-6 space-y-4">
                <Field label="Nama" id="rsv-nama" error={errors.nama}>
                  <input
                    id="rsv-nama"
                    className={cls('nama')}
                    placeholder="Nama kamu"
                    value={form.nama}
                    onChange={set('nama')}
                    autoComplete="name"
                    maxLength={60}
                    {...a11y('nama')}
                  />
                </Field>

                <Field label="Nomor HP / WhatsApp" id="rsv-hp" error={errors.hp}>
                  <input
                    id="rsv-hp"
                    className={cls('hp')}
                    placeholder="081234567890"
                    value={form.hp}
                    onChange={set('hp')}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    {...a11y('hp')}
                  />
                </Field>

                <Field label="Outlet" id="rsv-outlet" error={errors.outlet}>
                  <select id="rsv-outlet" className={cls('outlet')} value={form.outlet} onChange={set('outlet')} {...a11y('outlet')}>
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>{o.nama}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tanggal" id="rsv-tanggal" error={errors.tanggal}>
                    <input
                      id="rsv-tanggal"
                      type="date"
                      className={cls('tanggal')}
                      value={form.tanggal}
                      min={minDate()}
                      max={maxDate()}
                      onChange={set('tanggal')}
                      {...a11y('tanggal')}
                    />
                  </Field>

                  <Field
                    label="Jam"
                    id="rsv-jam"
                    error={errors.jam}
                    hint={form.tanggal && slots.length === 0 ? 'Tidak ada jam tersisa di tanggal ini.' : undefined}
                  >
                    <select
                      id="rsv-jam"
                      className={cls('jam')}
                      value={form.jam}
                      onChange={set('jam')}
                      disabled={slots.length === 0 && !!form.tanggal}
                      {...a11y('jam')}
                    >
                      <option value="">Pilih jam</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Jumlah orang" id="rsv-jumlah" error={errors.jumlah}>
                  <select id="rsv-jumlah" className={cls('jumlah')} value={form.jumlah} onChange={set('jumlah')} {...a11y('jumlah')}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} orang</option>
                    ))}
                  </select>
                </Field>

                <Field label="Catatan (opsional)" id="rsv-catatan">
                  <textarea
                    id="rsv-catatan"
                    rows={2}
                    className={cls('catatan')}
                    placeholder="Mis. dekat jendela, ada kursi bayi"
                    value={form.catatan}
                    onChange={set('catatan')}
                    maxLength={200}
                  />
                </Field>

                <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting} aria-busy={submitting}>
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Mengirim...
                    </span>
                  ) : (
                    'Pesan meja'
                  )}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}