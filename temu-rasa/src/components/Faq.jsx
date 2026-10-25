import Reveal from './Reveal'

const faqs = [
  {
    q: 'Bisa pesan antar?',
    a: 'Bisa. Ongkir mulai Rp8.000 dan pesanan sampai dalam 25–45 menit.',
  },
  {
    q: 'Ada Wi-Fi dan colokan?',
    a: 'Ada, nyaman untuk nugas atau ngobrol lama.',
  },
  {
    q: 'Bayarnya bisa pakai apa?',
    a: 'Transfer bank (BCA, BNI, BRI, Mandiri), e-wallet (OVO, GoPay, DANA, ShopeePay), dan bayar di tempat (COD).',
  },
  {
    q: 'Bagaimana cara reservasi untuk rombongan?',
    a: 'Isi formulir reservasi di atas (maksimal 12 orang). Untuk rombongan lebih besar, hubungi kami lewat halo@temurasa.id.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="container-page scroll-mt-24 py-12 md:py-16">
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.25em] text-navy">
          <span aria-hidden="true" className="h-0.5 w-10 bg-navy" />
          Tanya Jawab
        </p>
        <h2 className="mt-4 font-display text-4xl font-black text-navy md:text-6xl">
          Pertanyaan yang <span className="scribble italic">sering ditanya</span>
        </h2>
      </Reveal>

      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl">
        {faqs.map((f) => (
          // `name` sama = hanya satu pertanyaan terbuka dalam satu waktu (browser modern)
          <details key={f.q} name="faq" className="group border-b border-navy/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-display text-xl font-bold text-navy transition-colors hover:text-navy-light md:text-2xl [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun-soft text-2xl font-normal leading-none text-navy transition-transform duration-300 group-open:rotate-45 group-open:bg-sun"
              >
                +
              </span>
            </summary>
            <p className="tr-anim-up pb-6 pr-12 leading-relaxed text-navy-dark/75">{f.a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  )
}