<template>
  <!-- La navbar se cache sur login/register grâce à ton v-if -->
  <nav v-if="!hideNavbar" class="w-full h-16 bg-gradient-to-r from-[#005da4] via-[#007cc3] to-[#0094d9] text-white px-12 flex items-center justify-between shadow-lg z-50">
    
    <router-link to="/" class="text-2xl font-bold tracking-tight">
      Bookstore
    </router-link>

    <div class="flex items-center gap-10 text-[12px] font-bold tracking-[0.2em] uppercase">
      <!-- Toujours visible -->
      <router-link to="/" class="hover:text-blue-200 transition-colors">Home</router-link>

      <!-- Visible uniquement si NON connecté -->
      <template v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="hover:text-blue-200 transition-colors">Login</router-link>
      </template>

      <!-- Visible pour TOUS les utilisateurs connectés (User et Admin) -->
      <template v-if="authStore.isLoggedIn">
        <router-link to="/books" class="hover:text-blue-200 transition-colors">All Books</router-link>
        
        <!-- Visible uniquement pour l'ADMIN -->
        <router-link v-if="authStore.isAdmin" to="/authors" class="hover:text-blue-200 transition-colors text-amber-300">
          Gestion Auteurs
        </router-link>

        <!-- Bouton Déconnexion -->
        <button @click="handleLogout" class="hover:text-red-300 transition-colors border-l pl-6 ml-4 border-white/20">
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

// Ta logique pour cacher la navbar sur certaines pages
const hideNavbar = computed(() => ['login', 'register'].includes(route.name))

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>