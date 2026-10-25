import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)' }}
      className="pointer-events-none fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-sun"
    />
  )
}