import { Link } from 'react-router-dom'

const styles = {
  primary:
    'bg-navy text-white shadow-card hover:bg-navy-dark hover:shadow-card-hover',
  accent:
    'bg-sun text-navy-dark shadow-sun hover:bg-sun-deep hover:text-white',
  outline:
    'border-2 border-navy/25 text-navy hover:border-navy hover:bg-navy/5',
  // BARU: tombol tanpa latar, untuk aksi kecil (Lihat Semua, Batal)
  ghost: 'text-navy hover:bg-navy/5',
}

// BARU: ukuran opsional. Default 'md' = ukuran lama (px-6 py-3 text-sm)
const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  className = '',
  children,
  ...rest
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:transform-none ${sizes[size]} ${styles[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}