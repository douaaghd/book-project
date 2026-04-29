import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN')

  // ✅ LOGIN
  function login(credentials) {
    return authService.signin({
      username: credentials.username,
      password: credentials.password
    })
    .then((res) => {
      const data = res.data

      token.value = data.access_token
      user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      }

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    })
    .catch((err) => {
      console.error("Login failed:", err)
      return false
    })
  }

  // ✅ REGISTER (MANQUAIT CHEZ TOI)
  function register(userData) {
    return authService.signup(userData)
      .then((res) => {
        return true
      })
      .catch((err) => {
        console.error("Register failed:", err)
        return false
      })
  }

  // ✅ LOGOUT
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
    register, // 🔥 OBLIGATOIRE
    logout
  }
})