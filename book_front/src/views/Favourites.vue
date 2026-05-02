<template>
  <div class="page">
    <div class="bg-photo">
      <div class="bg-overlay"></div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="main-container">
      <div class="container-header">
        <div>
          <h1>Mes <em>Favoris</em> ❤️</h1>
          <p>{{ favoriteBooks.length }} livre{{ favoriteBooks.length !== 1 ? 's' : '' }} sauvegardé{{ favoriteBooks.length !== 1 ? 's' : '' }}</p>
        </div>
        <router-link to="/books" class="btn-browse">📚 Explorer les livres</router-link>
      </div>

      <div v-if="favoriteBooks.length === 0" class="empty-state">
        <div class="empty-icon">💔</div>
        <h2>Aucun favori pour l'instant</h2>
        <p>Explorez le catalogue et ajoutez vos livres préférés !</p>
        <router-link to="/books" class="btn-main">Explorer →</router-link>
      </div>

      <div v-else class="books-grid">
        <div v-for="(book, i) in favoriteBooks" :key="book.id" class="book-card" :style="{'--i':i}">
          <div class="card-topbar">
            <div class="year-badge"><span class="year-dot"></span>{{ book.year || '—' }}</div>
            <button @click="removeFromFav(book.id)" class="remove-btn">✕</button>
          </div>
          <div class="card-cover">
            <img :src="book.image" @error="handleImageError" class="cover-img" />
          </div>
          <div class="card-avatar-row">
            <div class="avatar-stack">
              <div class="avatar av1">{{ authorName(book.author)?.[0] ?? '?' }}</div>
              <div class="avatar av2">{{ authorName(book.author)?.split(' ')?.[1]?.[0] ?? '?' }}</div>
            </div>
            <span class="fav-badge">❤️ Favori</span>
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ book.title }}</h3>
            <p class="card-author-name">{{ authorName(book.author) }}</p>
          </div>
          <div class="card-footer">
            <div class="card-editor">
              <span class="editor-label">Éditeur</span>
              <span class="editor-value">{{ book.editor || '—' }}</span>
            </div>
            <button @click="removeFromFav(book.id)" class="remove-full-btn">Retirer ✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const favoriteBooks = ref([])

const authorName = (author) => {
  if (!author) return ''
  if (typeof author === 'object') {
    if (author.prenom || author.nom) return `${author.prenom ?? ''} ${author.nom ?? ''}`.trim()
    return Object.values(author).filter(v => typeof v === 'string').join(' ').trim()
  }
  return ''
}

const handleImageError = (e) => {
  e.target.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3e%3crect width='100%25' height='100%25' fill='%23dbeafe'/%3e%3ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3e📖%3c/text%3e%3c/svg%3e"
}

onMounted(() => {
  favoriteBooks.value = JSON.parse(localStorage.getItem('favourites') || '[]')
})

const removeFromFav = (bookId) => {
  favoriteBooks.value = favoriteBooks.value.filter(b => b.id !== bookId)
  localStorage.setItem('favourites', JSON.stringify(favoriteBooks.value))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { min-height: 100vh; font-family: 'DM Sans', sans-serif; position: relative; display: flex; align-items: stretch; padding: 20px; }
.bg-photo { position: fixed; inset: 0; z-index: 0; background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop&q=80'); background-size: cover; background-position: center; }
.bg-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,93,164,0.78) 0%, rgba(0,124,195,0.68) 45%, rgba(56,189,248,0.55) 100%); }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.28; animation: blobFloat 11s ease-in-out infinite alternate; }
.blob-1 { width: 480px; height: 480px; background: #005da4; top: -140px; left: -80px; }
.blob-2 { width: 300px; height: 300px; background: #38bdf8; bottom: -60px; right: 8%; animation-delay: -4s; }
.blob-3 { width: 220px; height: 220px; background: #7dd3fc; top: 40%; right: 20%; animation-delay: -7s; }
@keyframes blobFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(28px,-28px) scale(1.07); } }
.main-container { position: relative; z-index: 1; flex: 1; background: rgba(255,255,255,0.82); backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.9); border-radius: 28px; padding: 36px 40px 48px; box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,93,164,0.15); overflow-y: auto; max-height: calc(100vh - 40px); animation: containerIn 0.6s ease both; }
@keyframes containerIn { from { opacity: 0; transform: scale(0.98) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.container-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; gap: 20px; flex-wrap: wrap; }
.container-header h1 { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 700; color: #0c1a2e; line-height: 1.1; margin-bottom: 4px; }
.container-header h1 em { font-style: italic; color: #ef4444; }
.container-header p { color: #7a96b0; font-size: 0.85rem; }
.btn-browse { padding: 8px 16px; border-radius: 10px; border: 1.5px solid #c8dff0; background: #f0f8ff; color: #005da4; font-size: 0.82rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; }
.btn-browse:hover { background: #dbeafe; }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 4rem; margin-bottom: 16px; }
.empty-state h2 { font-family: 'Fraunces', serif; font-size: 1.5rem; color: #0c1a2e; margin-bottom: 8px; }
.empty-state p { color: #7a96b0; margin-bottom: 24px; }
.btn-main { display: inline-block; padding: 12px 28px; border-radius: 12px; border: none; background: linear-gradient(135deg, #005da4, #0094d9); color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; }
.btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,93,164,0.3); }
.books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 20px; }
.book-card { background: #fff; border: 1.5px solid #e0edf7; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,93,164,0.07); animation: cardIn 0.45s ease both; animation-delay: calc(var(--i) * 0.04s); transition: transform 0.25s ease, box-shadow 0.25s ease; }
.book-card:hover { transform: translateY(-5px); border-color: #fca5a5; box-shadow: 0 4px 12px rgba(239,68,68,0.1), 0 20px 40px rgba(239,68,68,0.08); }
@keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.card-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px 8px; }
.year-badge { display: flex; align-items: center; gap: 5px; background: rgba(0,124,195,0.08); border: 1px solid rgba(0,124,195,0.15); border-radius: 20px; padding: 3px 10px; font-size: 0.7rem; font-weight: 600; color: #007cc3; }
.year-dot { width: 6px; height: 6px; border-radius: 50%; background: #0094d9; flex-shrink: 0; }
.remove-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #fca5a5; background: #fff5f5; color: #ef4444; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.remove-btn:hover { background: #fee2e2; transform: scale(1.1); }
.card-cover { margin: 0 12px; height: 180px; border-radius: 12px; overflow: hidden; background: #dbeafe; flex-shrink: 0; }
.cover-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.book-card:hover .cover-img { transform: scale(1.05); }
.card-avatar-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px 2px; }
.avatar-stack { display: flex; }
.avatar { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #005da4; }
.av1 { background: linear-gradient(135deg, #bfdbfe, #93c5fd); }
.av2 { margin-left: -6px; background: linear-gradient(135deg, #93c5fd, #60a5fa); }
.fav-badge { font-size: 0.65rem; color: #ef4444; font-weight: 600; background: #fff5f5; border-radius: 10px; padding: 2px 8px; border: 1px solid #fca5a5; }
.card-info { padding: 8px 14px 4px; flex: 1; }
.card-title { font-family: 'Fraunces', serif; font-size: 0.92rem; font-weight: 700; color: #0c1a2e; line-height: 1.25; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-author-name { font-size: 0.75rem; color: #7a96b0; }
.card-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px 14px; border-top: 1px solid #f0f8ff; margin-top: 6px; }
.card-editor { display: flex; flex-direction: column; gap: 1px; }
.editor-label { font-size: 0.62rem; color: #b0c8dc; text-transform: uppercase; letter-spacing: 0.08em; }
.editor-value { font-size: 0.76rem; font-weight: 600; color: #005da4; }
.remove-full-btn { padding: 5px 12px; border-radius: 8px; border: 1.5px solid #fca5a5; background: #fff5f5; color: #ef4444; font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.remove-full-btn:hover { background: #fee2e2; }
@media (max-width: 768px) { .page { padding: 12px; } .main-container { padding: 24px 18px 36px; } .books-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .books-grid { grid-template-columns: 1fr; } }
</style>