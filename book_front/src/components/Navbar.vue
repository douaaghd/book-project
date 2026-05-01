<template>
  <!-- On affiche la navbar si hideNavbar est faux -->
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
        
        <!-- Visible par TOUS les connectés (User et Admin) -->
        <router-link to="/books" class="hover:text-blue-200 transition-colors">
          All Books
        </router-link>

        <!-- Section : ADMIN UNIQUEMENT (Apparaît seulement si role est ADMIN) -->
        <template v-if="authStore.isAdmin">
          <router-link 
            to="/add-book" 
            class="hover:text-green-300 transition-colors font-black"
          >
            + Add Book
          </router-link> 

          <router-link 
            to="/authors" 
            class="hover:text-amber-300 transition-colors font-black"
          >
            Gestion Auteurs
          </router-link>
        </template>

        <!-- BOUTON LOGOUT -->
        <button 
          @click="handleLogout" 
          class="hover:text-red-300 transition-colors border-l pl-6 ml-4 border-white/20 uppercase"
        >
          Logout
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Debug pour ta console (F12) - À vérifier pendant ta démo
watchEffect(() => {
  console.log("=== DEBUG NAVBAR ===")
  console.log("Connecté:", authStore.isLoggedIn)
  console.log("User Data:", authStore.user)
  console.log("Est Admin (Getter):", authStore.isAdmin)
})

const hideNavbar = computed(() => {
  const publicPages = ['/login', '/register', 'Login', 'Register']
  return publicPages.includes(route.name) || publicPages.includes(route.path)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Style pour le lien de la page actuelle */
.router-link-active {
  color: #bae6fd;
  border-bottom: 2px solid #bae6fd;
  padding-bottom: 4px;
}

/* Évite que le logo soit souligné quand on est sur Home */
.text-2xl.router-link-active {
  border-bottom: none;
}
</style>