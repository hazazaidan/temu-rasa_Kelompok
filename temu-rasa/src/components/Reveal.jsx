import { useEffect, useRef, useState } from 'react'

// Bungkus elemen apa pun, nanti muncul halus saat di-scroll ke layar.
// Contoh: <Reveal delay={150}> ... </Reveal>
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // browser lama tanpa IntersectionObserver: langsung tampilkan
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect() // cukup sekali, tidak diulang saat scroll balik
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`tr-reveal ${shown ? 'is-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}