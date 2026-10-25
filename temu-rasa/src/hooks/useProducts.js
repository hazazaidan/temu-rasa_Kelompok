import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '/menu.json'

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Gagal memuat data (HTTP ${res.status})`)
        }
        return res.json()
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Gagal memuat data. Coba lagi')
        setLoading(false)
      })

    return () => controller.abort()
  }, [tick])

  const reload = useCallback(() => setTick((n) => n + 1), [])

  return { products, loading, error, reload }
}