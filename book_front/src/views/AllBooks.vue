<template>
  <div class="min-h-screen bg-[#e5e7eb]">
    <!-- Barre de Recherche Grise (Start Year / End Year) -->
    <div class="bg-[#f3f4f6] p-4 shadow-md flex flex-wrap items-center justify-center gap-6 border-b border-gray-300">
      <div class="flex items-center gap-3">
        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">Start Year</label>
        <input v-model="filters.startYear" type="number" placeholder="YYYY" 
               class="border border-gray-300 p-1.5 rounded w-40 outline-none bg-white focus:border-blue-500" />
      </div>
      <div class="flex items-center gap-3">
        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider">End Year</label>
        <input v-model="filters.endYear" type="number" placeholder="YYYY" 
               class="border border-gray-300 p-1.5 rounded w-40 outline-none bg-white focus:border-blue-500" />
      </div>
      <button @click="applyFilters" 
              class="bg-[#334155] text-white px-8 py-2 rounded shadow-md hover:bg-black transition-all text-sm font-bold uppercase tracking-widest">
        Search
      </button>
    </div>

    <!-- Grille des Livres -->
    <div class="p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
      <div v-for="book in filteredBooks" :key="book.id" 
           class="bg-white rounded shadow-xl overflow-hidden flex flex-col items-center pb-8 border border-gray-50 transition-transform hover:scale-[1.02]">
        
        <!-- Cover -->
        <div class="w-full h-72 bg-gray-200">
          <img :src="book.cover || 'https://via.placeholder.com/300x400'" class="w-full h-full object-cover shadow-inner" />
        </div>

        <!-- Infos du livre -->
        <div class="p-6 text-center w-full">
          <h3 class="text-[#005da4] font-bold text-xl mb-2">{{ book.title }}</h3>
          <p class="text-gray-600 font-medium text-lg mb-6">{{ book.year }}</p>
          
          <div class="flex flex-col gap-3 px-4">
            <!-- Bouton USER : Favourites -->
            <button v-if="!authStore.isAdmin" 
                    class="border-2 border-[#005da4] text-[#005da4] px-6 py-2 rounded font-bold text-sm hover:bg-blue-50 transition-all uppercase tracking-tighter">
              Add To Favourites
            </button>

            <!-- Boutons ADMIN : Edit / Delete -->
            <div v-if="authStore.isAdmin" class="flex gap-2 justify-center">
              <button @click="editBook(book.id)" class="bg-amber-500 text-white flex-1 py-2 rounded font-bold text-xs uppercase hover:bg-amber-600">
                Edit
              </button>
              <button @click="confirmDelete(book.id)" class="bg-red-500 text-white flex-1 py-2 rounded font-bold text-xs uppercase hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { bookService } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const books = ref([]);
const filters = ref({ startYear: '', endYear: '' });

const fetchBooks = async () => {
  try {
    const res = await bookService.getAll();
    books.value = res.data;
  } catch (err) {
    console.error("Erreur AllBooks:", err);
  }
};

onMounted(fetchBooks);

// Logique de filtrage dynamique
const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const bYear = parseInt(book.year);
    const sYear = parseInt(filters.value.startYear);
    const eYear = parseInt(filters.value.endYear);

    if (sYear && bYear < sYear) return false;
    if (eYear && bYear > eYear) return false;
    return true;
  });
});

const confirmDelete = async (id) => {
  if (confirm("Voulez-vous supprimer ce livre ?")) {
    await bookService.delete(id);
    fetchBooks(); // Recharge la liste après suppression
  }
};

const editBook = (id) => {
  console.log("Naviguer vers l'édition du livre :", id);
  // router.push(`/edit-book/${id}`)
};
</script>