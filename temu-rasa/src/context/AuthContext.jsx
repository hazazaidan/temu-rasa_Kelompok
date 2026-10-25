import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'temurasa_user'

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isModalOpen: false,
  modalMode: 'login', // 'login' | 'register'
  openModal: () => {},
  closeModal: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('login')

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      /* ignore storage errors */
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
    setIsModalOpen(false)
    toast.success(`Selamat datang kembali, ${userData.name}!`)
  }

  const logout = () => {
    setUser(null)
    toast.success('Kamu telah berhasil keluar.')
  }

  const openModal = (mode = 'login') => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isModalOpen,
        modalMode,
        setModalMode,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
