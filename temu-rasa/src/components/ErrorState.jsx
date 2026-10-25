import { WifiOff, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message = 'Gagal memuat data. Coba lagi', onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 rounded-[2rem] bg-white px-8 py-12 text-center shadow-card"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sun-soft">
        <WifiOff size={36} className="text-navy" />
      </span>
      <h2 className="font-display text-2xl font-black text-navy">Ups, ada masalah</h2>
      <p className="text-sm text-navy-dark/65">{message}</p>
      {onRetry && (
        <Button className="mt-2 inline-flex items-center gap-2" onClick={onRetry}>
          <RefreshCw size={16} /> Coba lagi
        </Button>
      )}
    </div>
  )
}