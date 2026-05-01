import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {

  // ── State 
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // ── Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'ROLE_ADMIN')
  const isUser     = computed(() => isLoggedIn.value && !isAdmin.value)

  // ── Actions — retournent des Promise (.then/.catch)

  // Connexion — POST /auth/signin
  // body: { identifiant, password }
  // réponse: { id, username, email, role, access_token, ... }
  function login(credentials) {
    return authService.signin(credentials)
      .then((res) => {
        const data = res.data
        // Le backend renvoie access_token (pas token)
        token.value = data.access_token
        user.value  = {
          id:       data.id,
          username: data.username,
          email:    data.email,
          role:     data.role
        }
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user',  JSON.stringify(user.value))
        return user.value
      })
  }

  // Inscription — POST /auth/signup
  // body: { email, username, password, role? }
  function register(userData) {
    return authService.signup(userData)
      .then((res) => {
        // Le signup ne renvoie pas de token → on redirige vers login
        return res.data
      })
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value  = null
  }

  return { token, user, isLoggedIn, isAdmin, isUser, login, register, logout }
})
