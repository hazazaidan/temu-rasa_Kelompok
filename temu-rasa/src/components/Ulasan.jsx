import { useMemo, useState } from 'react'
import { Loader2, Quote, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from './Button'
import Reveal from './Reveal'

// Opsional: isi VITE_REVIEW_URL di .env.local (Formspree / MockAPI) supaya ulasan dikirim ke layanan.
// Kalau kosong, ulasan hanya disimpan di localStorage.
const REVIEW_URL = import.meta.env.VITE_REVIEW_URL
const STORAGE_KEY = 'temurasa-reviews'
const MAX_SHOWN = 6

// Ulasan contoh (selalu tampil). Ulasan buatan pengunjung disimpan terpisah di localStorage.
const seedReviews = [
  { id: 's1', nama: 'Nadia Larasati', peran: 'Mahasiswi Bandung', rating: 5, teks: 'Geprek-nya pedas pas dan renyah banget, es kopi susunya pas banget nemenin nugas seharian sampai malam.' },
  { id: 's2', nama: 'Budi Santoso', peran: 'Pecinta Kuliner Minang', rating: 5, teks: 'Rendang Padang-nya empuk luar biasa, bumbu hitamnya meresap sampai ke serat daging terdalam. Otentik!' },
  { id: 's3', nama: 'Dimas Prasetya', peran: 'Software Engineer (WFH)', rating: 5, teks: 'Wi-Fi kencang, banyak colokan, suasana adem. Sate ayam Madura sama es cendol nangkanya wajib dipesan!' },
  { id: 's4', nama: 'Salsa & Fikri', peran: 'Pelanggan Setia', rating: 5, teks: 'Tempat favorit buat ngedate dan ngobrol santai. Pelayanan ramah, tempat bersih, dan pisang goreng kejunya juara.' },
  { id: 's5', nama: 'Ibu Ratna Dewi', peran: 'Ibu Rumah Tangga', rating: 5, teks: 'Pesan antar 20 porsi mie ayam & tempe mendoan buat acara arisan keluarga, sampai tepat waktu dan masih hangat!' },
  { id: 's6', nama: 'Kevin Leonardo', peran: 'Food Vlogger', rating: 5, teks: 'Bebek goreng sambal koreknya garing di luar juicy di dalam! Perpaduan rasa tradisional dan konsep modern yang sempurna.' },
  { id: 's7', nama: 'Annisa Rahma', peran: 'Pekerja Kantoran', rating: 5, teks: 'Makan siangnya cepat dan porsinya mengenyangkan. Soto ayam Lamongannya gurih banget dengan serbuk koya melimpah.' },
  { id: 's8', nama: 'Rizky Pratama', peran: 'Pelanggan Dago', rating: 4, teks: 'Pesan antar via kurir sampai kurang dari 30 menit. Nasi goreng kampungnya berasa bumbu rumahan yang ngangenin.' },
]

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const clean = (v) => v.replace(/\s+/g, ' ').trim() // sanitasi: buang spasi berlebih

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
const saveReviews = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* abaikan: storage penuh atau diblokir */
  }
}

async function sendReview(payload) {
  if (!REVIEW_URL) {
    await wait(900) // jeda singkat supaya state "Mengirim..." terlihat
    return
  }
  const res = await fetch(REVIEW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

// Urutan ini dipakai untuk memfokuskan kolom pertama yang salah
const FIELD_ORDER = ['nama', 'rating', 'teks']

function validate(f) {
  const e = {}
  const nama = clean(f.nama)
  const peran = clean(f.peran)
  const teks = clean(f.teks)

  if (nama.length < 2) e.nama = 'Nama minimal 2 huruf'
  else if (nama.length > 40) e.nama = 'Nama maksimal 40 karakter'

  if (peran.length > 30) e.peran = 'Maksimal 30 karakter'

  if (!Number.isInteger(f.rating) || f.rating < 1 || f.rating > 5) e.rating = 'Pilih rating bintang'

  if (teks.length < 10) e.teks = 'Ulasan minimal 10 karakter'
  else if (teks.length > 200) e.teks = 'Ulasan maksimal 200 karakter'

  return e
}

const fmtAvg = (n) => n.toFixed(1).replace('.', ',')

// Deretan bintang tampilan saja (bukan input)
function Stars({ value, size = 18 }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? 'fill-sun text-sun' : 'text-sun/40'}
        />
      ))}
    </span>
  )
}

// Input rating: 5 bintang yang bisa diklik
function RatingInput({ value, onChange, invalid }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div
      role="group"
      aria-labelledby="rv-rating-label"
      className="flex gap-1"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          id={n === 1 ? 'rv-rating' : undefined}
          type="button"
          aria-label={`Beri ${n} bintang`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className={`rounded-lg p-1 transition-transform hover:scale-110 active:scale-95 ${
            invalid ? 'bg-chili/10' : ''
          }`}
        >
          <Star size={30} className={n <= shown ? 'fill-sun text-sun' : 'text-sun/40'} />
        </button>
      ))}
    </div>
  )
}

function Field({ label, id, error, hint, children }) {
  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy-dark">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-navy/55">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs font-semibold text-chili">{error}</p>
      )}
    </div>
  )
}

const emptyForm = () => ({ nama: '', peran: '', rating: 0, teks: '' })

export default function Ulasan() {
  const [mine, setMine] = useState(loadReviews) // ulasan buatan pengunjung
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const all = useMemo(() => [...mine, ...seedReviews], [mine])
  const shown = expanded ? all : all.slice(0, 6)
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length

  const set = (k) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [k]: value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const openForm = () => {
    setOpen(true)
    // tunggu form tampil, lalu fokus ke kolom pertama
    setTimeout(() => document.getElementById('rv-nama')?.focus(), 50)
  }

  const closeForm = () => {
    setOpen(false)
    setErrors({})
  }

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return // cegah klik ganda

    const errs = validate(form)
    setErrors(errs)
    const firstBad = FIELD_ORDER.find((k) => errs[k])
    if (firstBad) {
      toast.error('Periksa lagi data ulasan')
      document.getElementById(firstBad === 'rating' ? 'rv-rating' : `rv-${firstBad}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const review = {
        id: `u-${Date.now()}`,
        nama: clean(form.nama),
        peran: clean(form.peran) || 'Pelanggan',
        rating: form.rating,
        teks: clean(form.teks),
        baru: true,
      }
      await sendReview(review)
      const next = [review, ...mine]
      setMine(next)
      saveReviews(next)
      setForm(emptyForm())
      setOpen(false)
      toast.success('Terima kasih! Ulasanmu sudah masuk.')
    } catch {
      toast.error('Ulasan gagal dikirim. Coba lagi sebentar lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const cls = (k) => `input ${errors[k] ? '!border-chili !ring-chili/20' : ''}`
  const a11y = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `rv-${k}-err` : undefined })

  return (
    <section id="ulasan" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Kata Mereka
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Disukai <span className="scribble italic">pelanggan</span> kami
        </h2>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-navy-dark/75">
          <span className="flex items-center gap-1 font-extrabold text-navy">
            <Star size={16} className="fill-sun text-sun" /> 4,9 dari 5,0
          </span>
          <span className="text-navy/40">•</span>
          <span>Berdasarkan <b>{(5000 + mine.length).toLocaleString('id-ID')}+ ulasan</b> pelanggan puas</span>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {shown.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 100}>
            <figure className="relative flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
              <Quote size={34} aria-hidden="true" className="absolute right-6 top-6 fill-sun text-sun" />
              <div className="flex items-center gap-3">
                <Stars value={r.rating} />
                {r.baru && (
                  <span className="rounded-full bg-sun-soft px-2.5 py-0.5 text-[11px] font-extrabold text-navy">Baru</span>
                )}
              </div>
              <blockquote className="mt-5 flex-1 leading-relaxed text-navy-dark/80">
                “{r.teks}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun-soft font-display text-xl font-black text-navy"
                >
                  {r.nama.charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="block font-display text-lg font-bold leading-tight text-navy">{r.nama}</span>
                  <span className="text-sm text-navy/60">{r.peran}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* Tombol / form tulis ulasan */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {all.length > 6 && !open && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Ulasan (${all.length})`}
          </Button>
        )}
        {!open && (
          <Button variant="accent" size="lg" onClick={openForm}>
            Tulis ulasan
          </Button>
        )}
      </div>

      {open && (
        <form
          onSubmit={submit}
          noValidate
          aria-label="Tulis ulasan"
          className="tr-anim-up mx-auto mt-2 max-w-xl space-y-4 rounded-[2rem] bg-white p-6 shadow-card md:p-9"
        >
          <h3 className="font-display text-3xl font-bold text-navy">Tulis ulasan</h3>

          <Field label="Nama" id="rv-nama" error={errors.nama}>
            <input
              id="rv-nama"
              className={cls('nama')}
              placeholder="Nama kamu"
              value={form.nama}
              onChange={set('nama')}
              autoComplete="name"
              maxLength={40}
              {...a11y('nama')}
            />
          </Field>

          <Field label="Kamu siapa? (opsional)" id="rv-peran" error={errors.peran}>
            <input
              id="rv-peran"
              className={cls('peran')}
              placeholder="Mis. Mahasiswa, Pelanggan Dago"
              value={form.peran}
              onChange={set('peran')}
              maxLength={30}
              {...a11y('peran')}
            />
          </Field>

          <div>
            <p id="rv-rating-label" className="mb-1.5 text-sm font-bold text-navy-dark">Rating</p>
            <RatingInput
              value={form.rating}
              invalid={!!errors.rating}
              onChange={(n) => {
                setForm((f) => ({ ...f, rating: n }))
                setErrors((er) => ({ ...er, rating: undefined }))
              }}
            />
            {errors.rating && (
              <p role="alert" className="mt-1.5 text-xs font-semibold text-chili">{errors.rating}</p>
            )}
          </div>

          <Field
            label="Ulasanmu"
            id="rv-teks"
            error={errors.teks}
            hint={`${form.teks.length}/200 karakter (minimal 10)`}
          >
            <textarea
              id="rv-teks"
              rows={4}
              className={cls('teks')}
              placeholder="Ceritakan pengalamanmu di Temu Rasa"
              value={form.teks}
              onChange={set('teks')}
              maxLength={200}
              {...a11y('teks')}
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="accent" size="lg" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Mengirim...
                </span>
              ) : (
                'Kirim ulasan'
              )}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={closeForm} disabled={submitting}>
              Batal
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}