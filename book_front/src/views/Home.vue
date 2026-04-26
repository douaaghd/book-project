<template>
  <div class="min-h-screen bg-white flex flex-col">
    <section class="py-16 px-6 text-center border-b border-gray-100">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Découvrez des livres pour tous les goûts</h1>
      <p class="text-gray-500 mb-8 max-w-2xl mx-auto">
        Des classiques intemporels aux derniers best-sellers, trouvez votre prochaine lecture ici.
      </p>
      <button class="bg-[#005da4] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#007cc3] transition-all">
        Explorer le catalogue
      </button>
    </section>

    <main class="flex-grow max-w-6xl mx-auto py-12 px-6">
      <h2 class="text-2xl font-semibold text-center text-gray-700 mb-12 uppercase tracking-widest">
        Livres populaires
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>
    </main>

    <footer class="bg-[#1a202c] text-white py-12 px-6 text-center">
      <h3 class="text-xl font-bold mb-2">Besoin d'aide ?</h3>
      <p class="text-gray-400 text-sm mb-6">Contactez-nous pour toute question ou assistance.</p>
      <button class="bg-[#007cc3] px-10 py-3 rounded-lg font-bold hover:bg-[#005da4] transition-colors">
        Contactez-nous
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
//import BookCard from '@/components/BookCard.vue'
//import { useBooksStore } from '@/stores/books'

const booksStore = useBooksStore()
const search = ref('')
const activeCat = ref('Tous')

const filteredBooks = computed(() => {
  let list = booksStore.books
  const query = search.value.toLowerCase().trim()

  if (query) {
    list = list.filter(b => 
      b.title?.toLowerCase().includes(query) || 
      b.author?.toLowerCase().includes(query)
    )
  }

  if (activeCat.value !== 'Tous') {
    list = list.filter(b => b.category === activeCat.value)
  }

  return list
})

onMounted(() => {
  booksStore.fetchAll().catch(() => {})
})
</script>

<style scoped>
/* Animations pour la grille de livres */
.book-list-enter-active,
.book-list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.book-list-enter-from,
.book-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* Animation subtile pour le titre */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
</style>