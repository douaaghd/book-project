<template>
  <div class="home">

    <!-- HERO (INCHANGÉ) -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1>The Biggest Bookstore<br/>In The World 📚</h1>
        <p class="subtitle">Discover thousands of books, authors and stories.</p>

        <div class="benefits">
          <span>🚚 Quick delivery</span>
          <span>💳 Easy payment</span>
          <span>🔥 Best deals</span>
          <span>🔒 Secure payment</span>
        </div>

        <router-link to="/books" class="hero-btn">Shop Now →</router-link>
      </div>
    </section>

    <!-- NEW ITEMS -->
    <section class="section">
      <div class="section-header">
        <h2>🆕 New Items</h2>
        <router-link to="/books">View All →</router-link>
      </div>

      <div class="books-grid">
        <div v-for="book in newItems" :key="book.id" class="book-card">

          <div class="card-img">
            <img :src="book.image || fallback" @error="onImgError" />
          </div>

          <div class="card-body">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author?.prenom }} {{ book.author?.nom }}</p>

            <div class="card-actions">
              <span class="price-badge">${{ book.price || '11.50' }}</span>
              <button class="cart-btn" @click="addToFav(book)">🛒</button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- BESTSELLERS -->
    <section class="section">
      <div class="section-header">
        <h2>🔥 Bestsellers</h2>
        <router-link to="/books">View All →</router-link>
      </div>

      <div class="books-grid">
        <div v-for="book in bestsellers" :key="book.id" class="book-card">

          <div class="card-img">
            <img :src="book.image || fallback" @error="onImgError" />
          </div>

          <div class="card-body">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author?.prenom }} {{ book.author?.nom }}</p>

            <div class="card-actions">
              <span class="price-badge">${{ book.price || '14.90' }}</span>
              <button class="cart-btn" @click="addToFav(book)">🛒</button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <h3>📚 Bookstore</h3>
          <p>Your gateway to thousands of stories.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <router-link to="/">Home</router-link>
          <router-link to="/books">Catalogue</router-link>
          <router-link to="/favourites">Favourites</router-link>
        </div>

        <div>
          <h4>Need Help?</h4>
          <p>📧 support@bookstore.com</p>
          <p>📞 +216 XX XXX XXX</p>
        </div>
      </div>

      <div class="footer-bottom">© 2026 Bookstore. All rights reserved.</div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bookService } from '@/services/api'

const books = ref([])

const fallback =
  "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3e%3crect width='100%25' height='100%25' fill='%23e2e8f0'/%3e%3ctext x='50%25' y='50%25' font-size='16' fill='%2364758b' text-anchor='middle'%3eNo Image%3c/text%3e%3c/svg%3e"

const newItems = computed(() => books.value.slice(0, 4))
const bestsellers = computed(() => books.value.slice(4, 8))

const onImgError = (e) => (e.target.src = fallback)

const addToFav = (book) => {
  const favs = JSON.parse(localStorage.getItem('favourites') || '[]')
  if (!favs.find(f => f.id === book.id)) {
    favs.push(book)
    localStorage.setItem('favourites', JSON.stringify(favs))
    alert(`${book.title} added!`)
  }
}

onMounted(async () => {
  const res = await bookService.getAll()
  books.value = res.data.listeBooks || []
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.home {
  font-family: 'Poppins', sans-serif;
  background: #fff;
}

/* ===== HERO (INCHANGÉ) ===== */
.hero {
  position: relative;
  height: 500px;
  background-image: url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 60px;
  color: white;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 550px;
}

.hero h1 {
  font-size: 44px;
  font-weight: 800;
}

.subtitle {
  margin: 15px 0;
  color: rgba(255, 255, 255, 0.9);
}

.hero-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: inline-block;
}

/* ===== SECTION ===== */
.section {
  padding: 40px 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 700;
}

/* ===== GRID (style catalogue simple) ===== */
.books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

/* ===== CARD STYLE SIMPLE ===== */
.book-card {
  text-align: center;
}

/* IMAGE STYLE CATALOGUE */
.card-img img {
  width: 140px;
  height: 210px;
  object-fit: cover;
  margin: auto;
}

/* TEXT */
.book-card h3 {
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.book-card p {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 8px;
}

/* ACTIONS (prix + bouton comme capture) */
.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

/* PRICE */
.price-badge {
  background: #f59e0b;
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 3px;
}

/* BUTTON SMALL */
.cart-btn {
  background: #f59e0b;
  border: none;
  color: white;
  padding: 4px 7px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

/* FOOTER */
.footer {
  background: #0f172a;
  color: white;
  padding: 50px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
}

.footer-bottom {
  margin-top: 30px;
  text-align: center;
  color: #94a3b8;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>