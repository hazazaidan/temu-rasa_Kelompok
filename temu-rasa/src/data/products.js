export const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

export const categories = ['Semua', 'Makanan', 'Minuman', 'Camilan']

// Ganti `image` dengan URL/gambar asli bila ada. Jika kosong, emoji dipakai sebagai placeholder.
export const products = [
  { id: 1, name: 'Nasi Ayam Geprek', category: 'Makanan', price: 18000, rating: 4.8, reviews: 1200, emoji: '🍗', bg: '#FDE7C8', bestSeller: true,
    desc: 'Ayam crispy dengan sambal khas Temu Rasa, disajikan dengan nasi hangat, lalapan, dan telur ceplok.',
    composition: ['Ayam', 'Nasi', 'Sambal', 'Telur', 'Lalapan'], variants: ['Level 1', 'Level 3', 'Level 5'] },
  { id: 2, name: 'Nasi Rendang', category: 'Makanan', price: 22000, rating: 4.7, reviews: 860, emoji: '🍛', bg: '#F6D9C4',
    desc: 'Rendang sapi empuk berbumbu pekat, dimasak lama hingga meresap.',
    composition: ['Daging sapi', 'Santan', 'Nasi', 'Rempah'], variants: ['Biasa', 'Jumbo'] },
  { id: 3, name: 'Mie Ayam Special', category: 'Makanan', price: 16000, rating: 4.6, reviews: 540, emoji: '🍜', bg: '#FFE9A8',
    desc: 'Mie kenyal dengan topping ayam kecap, pangsit, dan kuah kaldu gurih.',
    composition: ['Mie', 'Ayam', 'Pangsit', 'Sawi'], variants: ['Biasa', 'Pangsit Ekstra'] },
  { id: 4, name: 'Nasi Goreng Kampung', category: 'Makanan', price: 15000, rating: 4.5, reviews: 430, emoji: '🍳', bg: '#F9DDB5',
    desc: 'Nasi goreng cita rasa rumahan dengan teri, telur, dan acar.',
    composition: ['Nasi', 'Teri', 'Telur', 'Acar'], variants: ['Pedas', 'Tidak Pedas'] },
  { id: 5, name: 'Es Kopi Susu', category: 'Minuman', price: 16000, rating: 4.9, reviews: 2100, emoji: '🧋', bg: '#EAD7C3', bestSeller: true,
    desc: 'Espresso, susu segar, dan gula aren dalam segelas kesegaran.',
    composition: ['Espresso', 'Susu', 'Gula aren', 'Es batu'], variants: ['Less Sugar', 'Normal', 'Extra Shot'] },
  { id: 6, name: 'Matcha Latte', category: 'Minuman', price: 18000, rating: 4.6, reviews: 610, emoji: '🍵', bg: '#DCE8C6',
    desc: 'Matcha premium berpadu susu creamy, segar dan lembut.',
    composition: ['Matcha', 'Susu', 'Es batu'], variants: ['Less Sugar', 'Normal'] },
  { id: 7, name: 'Thai Tea', category: 'Minuman', price: 14000, rating: 4.5, reviews: 390, emoji: '🥤', bg: '#FFD9B0',
    desc: 'Teh Thailand manis dengan susu, wangi dan menyegarkan.',
    composition: ['Teh Thailand', 'Susu', 'Gula'], variants: ['Less Sugar', 'Normal'] },
  { id: 8, name: 'Chocolate Latte', category: 'Minuman', price: 16000, rating: 4.7, reviews: 720, emoji: '🍫', bg: '#E4CDBF',
    desc: 'Cokelat pekat dengan susu hangat atau dingin.',
    composition: ['Cokelat', 'Susu', 'Es batu'], variants: ['Panas', 'Dingin'] },
  { id: 9, name: 'French Fries', category: 'Camilan', price: 15000, rating: 4.4, reviews: 300, emoji: '🍟', bg: '#FFEFB5',
    desc: 'Kentang goreng renyah dengan bumbu pilihan.',
    composition: ['Kentang', 'Garam', 'Saus'], variants: ['Original', 'BBQ', 'Keju'] },
  { id: 10, name: 'Pisang Goreng Keju', category: 'Camilan', price: 12000, rating: 4.6, reviews: 280, emoji: '🍌', bg: '#FCE6A9',
    desc: 'Pisang goreng hangat dengan taburan keju dan susu.',
    composition: ['Pisang', 'Keju', 'Susu kental'], variants: ['Keju', 'Cokelat'] },
]
