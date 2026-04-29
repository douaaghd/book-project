<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-4">
    <div class="bg-white rounded-[40px] shadow-2xl w-full max-w-[400px] p-12 flex flex-col items-center border border-gray-100">
      
      <h2 class="text-3xl font-bold text-[#005da4] mb-2">Welcome Back</h2>
      <p class="text-gray-400 text-sm mb-10">Login to your account</p>

      <form @submit.prevent="onLogin" class="w-full space-y-6">
        <div class="w-full">
          <label class="block text-xs font-bold text-gray-500 uppercase ml-2 mb-2 tracking-wider">Email</label>
          <input v-model="email" type="email" placeholder="votre@email.com" class="w-full px-6 py-4 rounded-2xl bg-[#f8fafc] border-2 border-transparent focus:border-[#007cc3] outline-none transition-all text-sm shadow-inner" required />
        </div>

        <div class="w-full">
          <label class="block text-xs font-bold text-gray-500 uppercase ml-2 mb-2 tracking-wider">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" class="w-full px-6 py-4 rounded-2xl bg-[#f8fafc] border-2 border-transparent focus:border-[#007cc3] outline-none transition-all text-sm shadow-inner" required />
        </div>

        <div class="pt-6 flex flex-col items-center gap-4 w-full">
          <button type="submit" class="w-full bg-gradient-to-r from-[#005da4] to-[#007cc3] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-[#007cc3]/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
            Login
          </button>
          
          <router-link to="/register" class="text-[#007cc3] font-bold text-xs hover:underline mt-2">
            Don't have an account? Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const onLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await authStore.login({
      username: email.value,
      password: password.value
    })

    if (success) {
      console.log('Connexion réussie !')
      router.push('/')
    } else {
      errorMessage.value = "Identifiants incorrects"
    }

  } catch (error) {
    console.error("Login Error:", error)
    errorMessage.value = "Erreur serveur ou identifiants incorrects"
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>