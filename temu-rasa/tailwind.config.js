/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        sand: '#F3EBDD',
        navy: { DEFAULT: '#0F3870', dark: '#0A2750', light: '#1F57A8' }, // light = BARU
        sun: { DEFAULT: '#F5B21B', soft: '#FFF3CF', deep: '#E39A00' }, // deep = BARU
        ink: '#1B2437', // BARU: teks gelap yang lebih hangat dari hitam
        chili: '#D8432B', // BARU: aksen sambal untuk badge / diskon
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'], // BARU: tagline tulisan tangan
      },
      boxShadow: {
        // BARU: bayangan hangat kebiruan, dipakai card & tombol
        card: '0 10px 30px -12px rgba(15, 56, 112, 0.25)',
        'card-hover': '0 18px 40px -14px rgba(15, 56, 112, 0.35)',
        sun: '0 8px 20px -6px rgba(245, 178, 27, 0.55)',
      },
      borderRadius: {
        blob: '60% 40% 55% 45% / 50% 55% 45% 50%', // BARU: bentuk organik di belakang foto
      },
      keyframes: {
        // BARU: dipakai modal keranjang & toast
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.25s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
      },
    },
  },
  plugins: [],
}