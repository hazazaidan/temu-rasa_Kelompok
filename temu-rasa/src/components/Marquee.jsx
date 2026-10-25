const words = ['Banyak Rasa', 'Satu Cerita', 'Good Food', 'Good Mood']

// Satu rombongan teks. Dirender dua kali supaya animasi bisa berulang tanpa putus.
function Group() {
  return (
    <div className="flex shrink-0 items-center gap-9 pr-9">
      {[...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center gap-9">
          <span>{w}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  )
}

// Pita kuning dengan tulisan berjalan. Berhenti sebentar saat kursor diarahkan ke atasnya.
export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="tr-marquee overflow-hidden whitespace-nowrap bg-sun py-4 font-display text-2xl font-semibold italic text-navy"
    >
      <div className="tr-marquee-track flex w-max">
        <Group />
        <Group />
      </div>
    </div>
  )
}