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
          <h1>Notre <em>Collection</em></h1>
          <p>{{ filteredBooks.length }} livre{{ filteredBooks.length !== 1 ? 's' : '' }} disponible{{ filteredBooks.length !== 1 ? 's' : '' }}</p>
        </div>
        <button v-if="userIsAdmin" @click="isAdminMode = !isAdminMode" class="btn-toggle">
          {{ isAdminMode ? '⊟ Cartes' : '⊞ Tableau' }}
        </button>
      </div>

      <div class="search-bar">
        <div class="search-field search-main">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/></svg>
          <input v-model="filters.title" type="text" placeholder="Rechercher un livre..." />
        </div>
        <div class="search-field">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"/></svg>
          <input v-model="filters.author" type="text" placeholder="Auteur..." />
        </div>
        <div class="search-field search-year">
          <input v-model="filters.startYear" type="number" placeholder="Min" />
        </div>
        <div class="search-field search-year">
          <input v-model="filters.endYear" type="number" placeholder="Max" />
        </div>
      </div>

      <div v-if="filteredBooks.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <p>Aucun livre ne correspond à votre recherche.</p>
      </div>

      <div v-else-if="isAdminMode && userIsAdmin" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:60px">Couv.</th>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Année</th>
              <th style="width:180px;text-align:center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book, i) in filteredBooks" :key="book.id" :style="{'--i':i}">
              <td><img :src="book.image" @error="handleImageError" class="table-img" /></td>
              <td class="td-title">{{ book.title }}</td>
              <td class="td-author">{{ authorName(book.author) }}</td>
              <td class="td-year">{{ book.year }}</td>
              <td>
                <div class="table-actions">
                  <button @click="openEditModal(book)" class="btn-edit-sm">✎ Modifier</button>
                  <button @click="confirmDelete(book.id)" class="btn-del-sm">✕ Suppr.</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="books-grid">
        <div v-for="(book, i) in filteredBooks" :key="book.id" class="book-card" :style="{'--i':i}">
          <div class="card-topbar">
            <div class="year-badge"><span class="year-dot"></span>{{ book.year || '—' }}</div>
            <button v-if="!userIsAdmin" @click="addToFavourites(book)" class="fav-btn" title="Ajouter aux favoris">❤️</button>
          </div>

          <div class="card-cover">
            <img :src="book.image" @error="handleImageError" class="cover-img" />
          </div>

          <div class="card-avatar-row">
            <div class="avatar-stack">
              <div class="avatar av1">{{ authorName(book.author)?.[0] ?? '?' }}</div>
              <div class="avatar av2">{{ authorName(book.author)?.split(' ')?.[1]?.[0] ?? '?' }}</div>
            </div>
            <span class="edition-badge">Livre</span>
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
            <div v-if="userIsAdmin" class="card-admin-btns">
              <button @click="openEditModal(book)" class="icon-btn edit-icon-btn">
                <svg viewBox="0 0 20 20" fill="currentColor" width="13"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"/></svg>
              </button>
              <button @click="confirmDelete(book.id)" class="icon-btn del-icon-btn">
                <svg viewBox="0 0 20 20" fill="currentColor" width="13"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal && userIsAdmin" class="modal-backdrop" @click.self="showEditModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Modifier le livre</h2>
          <button class="modal-close" @click="showEditModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="m-field"><label>Titre</label><input v-model="selectedBook.title" type="text" /></div>
          <div class="m-field"><label>Année</label><input v-model="selectedBook.year" type="number" /></div>
          <div class="m-field">
            <label>Auteur</label>
            <div class="sel-wrap">
              <select v-model="selectedBook.authorId">
                <option v-for="auth in authorsList" :key="auth.id" :value="auth.id">{{ authorName(auth) }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showEditModal = false" class="btn-ghost">Annuler</button>
          <button @click="handleUpdate" class="btn-main">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { bookService, authorService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const books = ref([])
const authorsList = ref([])
const filters = ref({ startYear: '', endYear: '', title: '', author: '' })
const isAdminMode = ref(false)
const showEditModal = ref(false)
const selectedBook = ref({})

const userIsAdmin = computed(() => {
  const role = localStorage.getItem('role')
  return authStore.isAdmin || role === 'ADMIN' || role === 'admin'
})

const authorName = (author) => {
  if (!author) return ''
  if (author.prenom || author.nom) return `${author.prenom ?? ''} ${author.nom ?? ''}`.trim()
  return Object.values(author).filter(v => typeof v === 'string').join(' ').trim()
}

const handleImageError = (e) => {
  e.target.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3e%3crect width='100%25' height='100%25' fill='%23dbeafe'/%3e%3ctext x='50%25' y='50%25' font-family='Arial' font-size='40' text-anchor='middle' dy='.3em'%3e📖%3c/text%3e%3c/svg%3e"
}

const fetchData = () => {
  bookService.getAll()
    .then(res => { books.value = res.data.listeBooks || [] })
    .catch(err => console.error('Erreur livres:', err))

  authorService.getAll()
    .then(res => { authorsList.value = Array.isArray(res.data) ? res.data : (res.data.listeAuthors || []) })
    .catch(err => console.error('Erreur auteurs:', err))
}

onMounted(fetchData)

const filteredBooks = computed(() => books.value.filter(book => {
  const bYear = parseInt(book.year)
  if (filters.value.startYear && bYear < parseInt(filters.value.startYear)) return false
  if (filters.value.endYear && bYear > parseInt(filters.value.endYear)) return false
  if (filters.value.title && !book.title?.toLowerCase().includes(filters.value.title.toLowerCase())) return false
  if (filters.value.author) {
    const allStrings = Object.values(book.author || {}).filter(v => typeof v === 'string').join(' ').toLowerCase()
    if (!allStrings.includes(filters.value.author.toLowerCase())) return false
  }
  return true
}))

// ✅ FAVORIS - localStorage
const addToFavourites = (book) => {
  const favs = JSON.parse(localStorage.getItem('favourites') || '[]')
  if (!favs.find(f => f.id === book.id)) {
    favs.push(book)
    localStorage.setItem('favourites', JSON.stringify(favs))
    console.log('ajouté')
  } else {
    alert('Déjà dans vos favoris !')
  }
}

const openEditModal = (book) => {
  if (!userIsAdmin.value) return
  selectedBook.value = { ...book }
  showEditModal.value = true
}

const handleUpdate = () => {
  bookService.update(selectedBook.value.id, selectedBook.value)
    .then(() => { showEditModal.value = false; fetchData(); alert('Livre mis à jour !') })
    .catch(err => console.error('Erreur update:', err))
}

const confirmDelete = (id) => {
  if (confirm('Supprimer ce livre ?')) {
    bookService.delete(id).then(() => fetchData())
  }
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
.container-header h1 em { font-style: italic; color: #007cc3; }
.container-header p { color: #7a96b0; font-size: 0.85rem; font-weight: 300; }
.btn-toggle { padding: 8px 16px; border-radius: 10px; border: 1.5px solid #c8dff0; background: #f0f8ff; color: #005da4; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-toggle:hover { background: #dbeafe; }
.search-bar { display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; background: rgba(240,248,255,0.6); border: 1.5px solid #c8dff0; border-radius: 16px; padding: 14px 18px; align-items: center; }
.search-field { position: relative; display: flex; align-items: center; flex: 1; min-width: 160px; }
.search-main { flex: 2; }
.search-year { min-width: 110px; flex: 0 0 120px; }
.search-icon { position: absolute; left: 11px; width: 14px; color: #9ab8cf; pointer-events: none; }
.search-field input { width: 100%; background: #fff; border: 1.5px solid #d4e8f5; border-radius: 10px; padding: 9px 12px 9px 34px; font-size: 0.86rem; color: #0c1a2e; transition: all 0.2s; outline: none; }
.search-year input { padding-left: 12px; }
.search-field input::placeholder { color: #b0c8dc; }
.search-field input:focus { border-color: #007cc3; box-shadow: 0 0 0 3px rgba(0,124,195,0.1); }
.empty-state { text-align: center; padding: 60px; color: #9ab8cf; }
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 20px; }
.book-card { background: #fff; border: 1.5px solid #e0edf7; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,93,164,0.07); animation: cardIn 0.45s ease both; animation-delay: calc(var(--i) * 0.04s); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
.book-card:hover { transform: translateY(-5px); border-color: #93c5fd; box-shadow: 0 4px 12px rgba(0,93,164,0.1), 0 20px 40px rgba(0,93,164,0.14); }
@keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.card-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px 8px; }
.year-badge { display: flex; align-items: center; gap: 5px; background: rgba(0,124,195,0.08); border: 1px solid rgba(0,124,195,0.15); border-radius: 20px; padding: 3px 10px; font-size: 0.7rem; font-weight: 600; color: #007cc3; }
.year-dot { width: 6px; height: 6px; border-radius: 50%; background: #0094d9; flex-shrink: 0; }
.fav-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #e0edf7; background: #f8fbff; color: #9ab8cf; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.fav-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }
.card-cover { margin: 0 12px; height: 180px; border-radius: 12px; overflow: hidden; background: #dbeafe; flex-shrink: 0; }
.cover-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.book-card:hover .cover-img { transform: scale(1.05); }
.card-avatar-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px 2px; }
.avatar-stack { display: flex; }
.avatar { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #005da4; }
.av1 { background: linear-gradient(135deg, #bfdbfe, #93c5fd); }
.av2 { margin-left: -6px; background: linear-gradient(135deg, #93c5fd, #60a5fa); }
.edition-badge { font-size: 0.65rem; color: #9ab8cf; font-weight: 600; background: #f0f8ff; border-radius: 10px; padding: 2px 8px; }
.card-info { padding: 8px 14px 4px; flex: 1; }
.card-title { font-family: 'Fraunces', serif; font-size: 0.92rem; font-weight: 700; color: #0c1a2e; line-height: 1.25; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-author-name { font-size: 0.75rem; color: #7a96b0; }
.card-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px 14px; border-top: 1px solid #f0f8ff; margin-top: 6px; }
.card-editor { display: flex; flex-direction: column; gap: 1px; }
.editor-label { font-size: 0.62rem; color: #b0c8dc; text-transform: uppercase; letter-spacing: 0.08em; }
.editor-value { font-size: 0.76rem; font-weight: 600; color: #005da4; }
.card-admin-btns { display: flex; gap: 6px; }
.icon-btn { width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.edit-icon-btn { background: #dbeafe; color: #005da4; }
.edit-icon-btn:hover { background: #005da4; color: #fff; }
.del-icon-btn { background: #fee2e2; color: #dc2626; }
.del-icon-btn:hover { background: #dc2626; color: #fff; }
.table-wrap { border-radius: 14px; border: 1.5px solid #d4e8f5; overflow: hidden; }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
thead tr { background: #f0f8ff; }
thead th { padding: 12px 18px; text-align: left; font-size: 0.67rem; font-weight: 700; color: #5a80a0; text-transform: uppercase; letter-spacing: 0.11em; border-bottom: 1.5px solid #d4e8f5; }
tbody tr { border-bottom: 1px solid #eaf3fb; transition: background 0.15s; animation: rowSlide 0.35s ease both; animation-delay: calc(var(--i) * 0.04s); }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #f5fbff; }
@keyframes rowSlide { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
tbody td { padding: 12px 18px; color: #1e3a5a; vertical-align: middle; }
.table-img { width: 36px; height: 50px; object-fit: cover; border-radius: 6px; }
.td-title { font-weight: 600; color: #0c1a2e; }
.td-author { color: #5a80a0; }
.td-year { color: #007cc3; font-weight: 600; font-size: 0.8rem; }
.table-actions { display: flex; gap: 8px; justify-content: center; }
.btn-edit-sm, .btn-del-sm { padding: 6px 13px; border-radius: 8px; border: none; font-size: 0.74rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-edit-sm { background: linear-gradient(135deg, #005da4, #0094d9); color: #fff; }
.btn-edit-sm:hover { transform: translateY(-1px); }
.btn-del-sm { background: #fee2e2; color: #b91c1c; }
.btn-del-sm:hover { background: #fecaca; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,30,70,0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
.modal-card { width: 100%; max-width: 460px; background: rgba(255,255,255,0.97); border-radius: 22px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,30,70,0.28); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 26px 18px; border-bottom: 1px solid #e0edf7; }
.modal-header h2 { font-family: 'Fraunces', serif; font-size: 1.35rem; font-weight: 700; color: #0c1a2e; }
.modal-close { width: 28px; height: 28px; border-radius: 50%; border: none; background: #f0f8ff; color: #5a80a0; cursor: pointer; }
.modal-body { padding: 20px 26px; display: flex; flex-direction: column; gap: 14px; }
.m-field { display: flex; flex-direction: column; gap: 5px; }
.m-field label { font-size: 0.73rem; font-weight: 700; color: #1e3a5a; text-transform: uppercase; }
.m-field input, .m-field select { width: 100%; background: rgba(240,248,255,0.7); border: 1.5px solid #c8dff0; border-radius: 10px; padding: 10px 13px; font-size: 0.88rem; color: #0c1a2e; outline: none; transition: all 0.2s; }
.m-field input:focus, .m-field select:focus { border-color: #007cc3; box-shadow: 0 0 0 3px rgba(0,124,195,0.12); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 26px 22px; border-top: 1px solid #e0edf7; }
.btn-ghost { padding: 9px 18px; border-radius: 10px; border: 1.5px solid #c8dff0; background: transparent; color: #5a80a0; font-size: 0.86rem; font-weight: 500; cursor: pointer; }
.btn-ghost:hover { background: #f0f8ff; }
.btn-main { padding: 9px 22px; border-radius: 10px; border: none; background: linear-gradient(135deg, #005da4, #0094d9); color: #fff; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
.btn-main:hover { transform: translateY(-2px); }
@media (max-width: 768px) { .page { padding: 12px; } .main-container { padding: 24px 18px 36px; } .search-bar { flex-direction: column; } .books-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .books-grid { grid-template-columns: 1fr; } }
</style>