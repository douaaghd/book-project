<template>
  <div class="min-h-screen bg-white">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-tag">📚 Your next adventure starts here</p>
        <h1 class="hero-title">There is nothing better<br/>than a good book</h1>
        <p class="hero-sub">From timeless classics to modern bestsellers, find your next read here.</p>
        <router-link to="/books" class="hero-btn">Shop Now →</router-link>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600" alt="Books" />
      </div>
    </section>

    <!-- Genres -->
    <section class="section">
      <h2 class="section-title">Browse by Genre</h2>
      <div class="genres-grid">
        <div v-for="genre in genres" :key="genre.name" class="genre-card" :style="{ background: genre.color }">
          <span class="genre-icon">{{ genre.icon }}</span>
          <span class="genre-name">{{ genre.name }}</span>
        </div>
      </div>
    </section>

    <!-- Livres Populaires -->
    <section class="section bg-gray">
      <h2 class="section-title">Popular Books</h2>
      <div class="books-grid">
        <div v-for="book in popularBooks" :key="book.id" class="book-card">
          <div class="book-img">
            <img :src="book.image || 'https://covers.openlibrary.org/b/id/8739161-L.jpg'" :alt="book.title" />
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.summary?.substring(0, 60) || 'A captivating read you will never forget.' }}...</p>
            <router-link to="/books" class="see-more-btn">See More</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-title">Need Help?</p>
      <p class="footer-sub">Contact us for any question or technical assistance.</p>
      <button class="footer-btn">Contact Us</button>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { bookService } from '@/services/api'

const books = ref([])
const popularBooks = computed(() => books.value.slice(0, 3))

const genres = [
  { name: 'Detective', icon: '🔍', color: '#fff3e0' },
  { name: 'Love', icon: '❤️', color: '#fce4ec' },
  { name: 'Novel', icon: '📖', color: '#e8f5e9' },
  { name: 'History', icon: '🏛️', color: '#e3f2fd' },
  { name: 'Science Fiction', icon: '🚀', color: '#ede7f6' },
  { name: 'Fantastic', icon: '🧙', color: '#e0f7fa' },
]

onMounted(async () => {
  try {
    const res = await bookService.getAll()
    books.value = res.data.listeBooks || []
  } catch (err) {
    console.error("Erreur Home:", err)
  }
})
</script>

<style scoped>
/* HERO */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 100px;
  background: linear-gradient(135deg, #f8faff 0%, #eef4ff 100%);
  gap: 40px;
}

.hero-content {
  max-width: 550px;
}

.hero-tag {
  color: #005da4;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 48px;
  font-weight: 900;
  color: #1e293b;
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero-sub {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-btn {
  background: #005da4;
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
}

.hero-btn:hover {
  background: #0094d9;
  transform: translateY(-2px);
}

.hero-image img {
  width: 450px;
  height: 380px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,93,164,0.15);
}

/* SECTIONS */
.section {
  padding: 60px 100px;
}

.bg-gray {
  background: #f8faff;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
}

/* GENRES */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.genre-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.genre-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.genre-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.genre-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

/* BOOKS */
.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}

.book-img img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.book-info {
  padding: 20px;
}

.book-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.book-info p {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
  line-height: 1.5;
}

.see-more-btn {
  background: #005da4;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.see-more-btn:hover {
  background: #0094d9;
}

/* FOOTER */
.footer {
  background: #1e293b;
  color: white;
  text-align: center;
  padding: 60px 20px;
}

.footer-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
}

.footer-sub {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 24px;
}

.footer-btn {
  background: #005da4;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.footer-btn:hover {
  background: #0094d9;
}
</style>