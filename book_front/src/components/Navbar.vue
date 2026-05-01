<template>
  <nav v-if="!hideNavbar" class="w-full h-16 bg-gradient-to-r from-[#005da4] via-[#007cc3] to-[#0094d9] text-white px-12 flex items-center justify-between shadow-lg z-50">
    
    <!-- Logo -->
    <router-link to="/" class="text-2xl font-bold tracking-tight">
      Bookstore
    </router-link>

    <div class="flex items-center gap-10 text-[12px] font-bold tracking-[0.2em] uppercase">
      
      <!-- Toujours visible -->
      <router-link to="/" class="hover:text-blue-200 transition-colors">
        Home
      </router-link>

      <!-- Section : Utilisateur NON connecté -->
      <template v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="hover:text-blue-200 transition-colors">
          Login
        </router-link>
      </template>

      <!-- Section : Utilisateur CONNECTÉ -->
      <template v-if="authStore.isLoggedIn">
        
        <router-link to="/books" class="hover:text-blue-200 transition-colors">
          All Books
        </router-link>

        <!-- ADD BOOK (Visible par tous les connectés pour éviter les bugs de rôle) -->
        <router-link 
          to="/add-book" 
          class="hover:text-green-300 transition-colors"
        >
          Add Book
        </router-link> 

        <!-- GESTION AUTEURS -->
        <router-link 
          to="/authors" 
          class="hover:text-amber-300 transition-colors"
        >
          Gestion Auteurs
        </router-link>

        <!-- LOGOUT -->
        <button 
          @click="handleLogout" 
          class="hover:text-red-300 transition-colors border-l pl-6 ml-4 border-white/20"
        >
          Logout
        </button>

      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

// La navbar est visible partout par défaut
const hideNavbar = computed(() => false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Tu peux ajouter des styles spécifiques ici si besoin */
.router-link-active {
  color: #bae6fd; /* Met en valeur le lien de la page active */
  text-decoration: underline;
  text-underline-offset: 8px;
}
</style>