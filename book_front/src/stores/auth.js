import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth' // On pointe vers le service corrigé

export const useAuthStore = defineStore('auth', () => {

  // ── STATE
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  // ── GETTERS
  const isLoggedIn = computed(() => !!token.value)
  
  // Vérification robuste du rôle pour la Navbar
  const isAdmin = computed(() => {
    const role = user.value?.role?.toUpperCase() || '';
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  })

  // ── ACTIONS
  async function login(credentials) {
    try {
      const res = await authService.signin(credentials)
      const data = res.data

      // On stocke les données
      token.value = data.access_token
      user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role // Le backend doit envoyer 'ADMIN' ou 'ROLE_ADMIN'
      }

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return true 
    } catch (error) {
      console.error("Erreur Login Store:", error)
      return false
    }
  }

  async function register(userData) {
    try {
      await authService.signup(userData)
      return true
    } catch (error) {
      console.error("Erreur Register Store:", error)
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { 
    token, 
    user, 
    isLoggedIn, 
    isAdmin, 
    login, 
    register, 
    logout 
  }
})