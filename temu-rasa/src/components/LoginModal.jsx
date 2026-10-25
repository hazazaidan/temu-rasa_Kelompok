import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

export default function LoginModal() {
  const { isModalOpen, modalMode, setModalMode, closeModal, login } = useAuth()

  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleChooserOpen, setGoogleChooserOpen] = useState(false)
  const [customGoogleName, setCustomGoogleName] = useState('')
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false)

  // Akun Google yang terdeteksi / tersimpan di perangkat ini
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState(() => {
    try {
      const raw = localStorage.getItem('temurasa_google_accounts')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      /* ignore */
    }
    return [
      { name: 'Haza Zaidan', email: 'hazazaidan@gmail.com', phone: '081234567890' },
      { name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '081298765432' },
    ]
  })

  if (!isModalOpen) return null

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) {
      toast.error('Masukkan email atau no. WhatsApp')
      return
    }
    if (!password) {
      toast.error('Masukkan kata sandi')
      return
    }

    setLoading(true)
    setTimeout(() => {
      login({
        name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Pelanggan Setia',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'pelanggan@temurasa.id',
        phone: emailOrPhone.startsWith('08') || emailOrPhone.startsWith('+62') ? emailOrPhone : '081234567890',
      })
      setLoading(false)
    }, 500)
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Masukkan nama lengkap')
      return
    }
    if (!regPhone.trim()) {
      toast.error('Masukkan nomor WhatsApp')
      return
    }
    if (!password || password.length < 6) {
      toast.error('Kata sandi minimal 6 karakter')
      return
    }

    setLoading(true)
    setTimeout(() => {
      login({
        name: name.trim(),
        email: emailOrPhone.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@temurasa.id`,
        phone: regPhone.trim(),
      })
      setLoading(false)
    }, 500)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      login({
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        phone: '081298765432',
      })
      setLoading(false)
    }, 350)
  }

  const selectGoogleAccount = (acc) => {
    setLoading(true)
    try {
      const updated = [acc, ...savedGoogleAccounts.filter((x) => x.email !== acc.email)]
      setSavedGoogleAccounts(updated)
      localStorage.setItem('temurasa_google_accounts', JSON.stringify(updated))
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      login({
        name: acc.name,
        email: acc.email,
        phone: acc.phone || '081234567890',
      })
      setLoading(false)
      setGoogleChooserOpen(false)
    }, 350)
  }

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault()
    if (!customGoogleName.trim() || !customGoogleEmail.trim()) {
      toast.error('Masukkan nama dan email Google Anda')
      return
    }
    const newAcc = {
      name: customGoogleName.trim(),
      email: customGoogleEmail.trim().toLowerCase(),
      phone: '081234567890',
    }
    selectGoogleAccount(newAcc)
  }

  const handleGoogleLogin = () => {
    setGoogleChooserOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-navy-dark/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box dengan max-height & scroll aman */}
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-[2.2rem] bg-cream shadow-2xl">
        {/* Tombol Tutup Sticky */}
        <button
          onClick={closeModal}
          aria-label="Tutup modal"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy transition hover:bg-navy/20"
        >
          <X size={18} />
        </button>

        {/* Area Scrollable Dalam Modal */}
        <div className="overflow-y-auto no-scrollbar p-6 sm:p-7">
          {googleChooserOpen ? (
            <div>
              {/* Header Google Chooser */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-navy/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h2 className="mt-3 font-display text-2xl font-black text-navy">
                  Pilih Akun Google
                </h2>
                <p className="mt-1 text-xs text-navy-dark/70">
                  Pilih akun di perangkat ini untuk melanjutkan ke <b>Temu Rasa</b>
                </p>
              </div>

              {/* Daftar Akun Google Perangkat */}
              <div className="mt-5 space-y-2.5">
                {savedGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => selectGoogleAccount(acc)}
                    disabled={loading}
                    className="flex w-full items-center gap-3.5 rounded-2xl border border-navy/15 bg-white p-3.5 text-left shadow-sm transition-all hover:border-sun hover:bg-sun-soft/50 hover:shadow-card active:scale-[0.99]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-black text-sun shadow-sm">
                      {acc.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-navy">{acc.name}</p>
                      <p className="truncate text-xs text-navy/60">{acc.email}</p>
                    </div>
                  </button>
                ))}

                {/* Gunakan Akun Lain */}
                {!showAddGoogleAccount ? (
                  <button
                    type="button"
                    onClick={() => setShowAddGoogleAccount(true)}
                    className="flex w-full items-center gap-3.5 rounded-2xl border-2 border-dashed border-navy/20 bg-white/70 p-3.5 text-left transition hover:border-navy/40 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-soft text-navy">
                      <User size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-navy">Gunakan Akun Google Lain</p>
                      <p className="text-[11px] text-navy/60">Ketik nama & email Google Anda</p>
                    </div>
                  </button>
                ) : (
                  <form
                    onSubmit={handleCustomGoogleSubmit}
                    className="rounded-2xl border border-navy/15 bg-white p-4 space-y-3 shadow-sm"
                  >
                    <p className="text-xs font-bold text-navy">Masukkan Akun Google Anda:</p>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-navy/70">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Haza Zaidan"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="input !bg-cream/40 !py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-navy/70">Alamat Email Google</label>
                      <input
                        type="email"
                        required
                        placeholder="nama@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="input !bg-cream/40 !py-2 text-xs"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="submit"
                        variant="accent"
                        size="sm"
                        disabled={loading}
                        className="flex-1 justify-center"
                      >
                        {loading ? 'Menghubungkan...' : 'Lanjutkan Masuk'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddGoogleAccount(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Tombol Kembali */}
              <div className="mt-6 border-t border-navy/10 pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setGoogleChooserOpen(false)
                    setShowAddGoogleAccount(false)
                  }}
                  className="text-xs font-semibold text-navy/60 hover:text-navy hover:underline"
                >
                  ← Kembali ke Pilihan Masuk Lain
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-xl font-black italic text-sun shadow-card">
                  T
                </div>
                <h2 className="mt-2.5 font-display text-2xl font-black text-navy sm:text-[26px]">
                  {modalMode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
                </h2>
                <p className="mt-1 text-xs text-navy-dark/70">
                  {modalMode === 'login'
                    ? 'Masuk untuk pantau pesanan & promo istimewa Temu Rasa.'
                    : 'Daftar sekarang dan nikmati sajian Nusantara favoritmu.'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="mt-4 flex rounded-full bg-navy/5 p-1">
                <button
                  type="button"
                  onClick={() => setModalMode('login')}
                  className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all sm:text-sm ${
                    modalMode === 'login'
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('register')}
                  className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all sm:text-sm ${
                    modalMode === 'register'
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Daftar Baru
                </button>
              </div>

          {/* Form Masuk */}
          {modalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-navy-dark">
                  Email atau Nomor WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="contoh@gmail.com / 081234..."
                    style={{ paddingLeft: '2.85rem' }}
                    className="input !bg-white !py-2.5 text-sm"
                  />
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-navy-dark">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => toast('Fitur reset sandi: link verifikasi telah dikirim.')}
                    className="text-[11px] font-semibold text-navy/60 hover:text-navy hover:underline"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                    className="input !bg-white !py-2.5 text-sm"
                  />
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                disabled={loading}
                className="mt-3 w-full justify-center !py-2.5"
              >
                {loading ? 'Memproses...' : 'Masuk Sekarang'}
              </Button>
            </form>
          ) : (
            /* Form Daftar */
            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-2.5">
              <div>
                <label className="mb-0.5 block text-xs font-bold text-navy-dark">Nama Lengkap</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    style={{ paddingLeft: '2.85rem' }}
                    className="input !bg-white !py-2 text-sm"
                  />
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                </div>
              </div>

              <div>
                <label className="mb-0.5 block text-xs font-bold text-navy-dark">Nomor WhatsApp</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="081234567890"
                    style={{ paddingLeft: '2.85rem' }}
                    className="input !bg-white !py-2 text-sm"
                  />
                  <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                </div>
              </div>

              <div>
                <label className="mb-0.5 block text-xs font-bold text-navy-dark">Email (Opsional)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="budi@example.com"
                    style={{ paddingLeft: '2.85rem' }}
                    className="input !bg-white !py-2 text-sm"
                  />
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                </div>
              </div>

              <div>
                <label className="mb-0.5 block text-xs font-bold text-navy-dark">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                    className="input !bg-white !py-2 text-sm"
                  />
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                disabled={loading}
                className="mt-3 w-full justify-center !py-2.5"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
              </Button>
            </form>
          )}

          {/* Separator */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-navy/10" />
            </div>
            <span className="relative bg-cream px-3 text-[10px] font-bold uppercase tracking-wider text-navy/50">
              Atau Pilihan Cepat
            </span>
          </div>

          {/* Quick Demo & Social Login */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-sun bg-sun/10 py-2 text-xs font-bold text-navy transition-all hover:bg-sun/20 active:scale-98"
            >
              <Sparkles size={14} className="text-sun" />
              Masuk Cepat Akun Demo (1-Klik)
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-navy/15 bg-white py-2 text-xs font-bold text-navy shadow-sm transition hover:bg-navy/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Lanjut dengan Google
            </button>
          </div>
        </>
      )}
    </div>
  </div>
</div>
)
}
