<template>
  <div class="min-h-screen bg-[#f3f4f6]">
    <!-- Hero Section -->
    <section class="bg-white py-16 px-4 text-center border-b border-gray-200">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-4">Découvrez des livres pour tous les goûts</h1>
      <p class="text-gray-500 max-w-2xl mx-auto mb-8">
        Des classiques intemporels aux derniers best-sellers, trouvez votre prochaine lecture ici.
      </p>
      <!-- Bouton d'exploration vers AllBooks -->
      <router-link to="/all-books" 
        class="bg-[#005da4] text-white px-10 py-3 rounded-md shadow-lg hover:bg-[#007cc3] transition-all font-bold text-sm">
        Explorer le catalogue
      </router-link>
    </section>

    <!-- Livres Populaires -->
    <section class="py-16 px-12">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-12">Livres populaires</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div v-for="book in popularBooks" :key="book.id" 
          class="bg-white p-8 rounded-lg shadow-md flex flex-col items-center border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="w-full h-96 bg-gray-200 mb-6 overflow-hidden rounded shadow-md">
            <img :src="book.cover || 'https://via.placeholder.com/300x450'" class="w-full h-full object-cover" />
          </div>
          <h3 class="font-bold text-xl text-gray-800 text-center uppercase tracking-tight">{{ book.title }}</h3>
          <p class="text-sm text-gray-500 text-center mt-3 mb-8 px-2">
            Un résumé captivant pour ce livre qui restera gravé dans votre mémoire.
          </p>
          <button @click="$router.push('/all-books')" 
            class="bg-[#1e293b] text-white px-8 py-2 rounded shadow hover:bg-black transition-colors font-bold text-sm">
            Voir plus
          </button>
        </div>
      </div>
    </section>

    <!-- Footer Aide -->
    <footer class="bg-[#1e293b] text-white py-14 text-center mt-12">
      <p class="font-bold text-xl mb-3">Besoin d'aide ?</p>
      <p class="text-sm text-gray-400 mb-8 px-4">Contactez-nous pour toute question ou assistance technique.</p>
      <button class="bg-[#005da4] px-10 py-3 rounded font-bold hover:bg-[#007cc3] transition-all">
        Contactez-nous
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { bookService } from '@/services/api';

const books = ref([]);
const popularBooks = computed(() => books.value.slice(0, 3)); // Sélectionne les 3 premiers livres

onMounted(async () => {
  try {
    const res = await bookService.getAll();
    books.value = res.data.listeBooks || [];
  } catch (err) {
    console.error("Erreur Home:", err);
  }
});
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