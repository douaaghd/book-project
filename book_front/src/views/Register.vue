<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-4">
    <div class="bg-white rounded-[40px] shadow-2xl w-full max-w-[400px] p-12 flex flex-col items-center border border-gray-100">
      
      <h2 class="text-3xl font-bold text-[#005da4] mb-2">Create Account</h2>
      <p class="text-gray-400 text-sm mb-10">Join our bookstore today</p>

      <form @submit.prevent="onRegister" class="w-full space-y-5">
        <input v-model="form.username" type="text" placeholder="Username" class="w-full px-6 py-4 rounded-2xl bg-[#f8fafc] outline-none text-sm border-2 border-transparent focus:border-[#007cc3]" required />
        <input v-model="form.email" type="email" placeholder="Email" class="w-full px-6 py-4 rounded-2xl bg-[#f8fafc] outline-none text-sm border-2 border-transparent focus:border-[#007cc3]" required />
        <input v-model="form.password" type="password" placeholder="Password" class="w-full px-6 py-4 rounded-2xl bg-[#f8fafc] outline-none text-sm border-2 border-transparent focus:border-[#007cc3]" required />
        
        <div class="pt-6 w-full">
          <button type="submit" class="w-full bg-gradient-to-r from-[#005da4] to-[#007cc3] text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-all uppercase tracking-widest text-sm">
            Register
          </button>
          
          <router-link to="/login" class="block text-center text-[#007cc3] font-bold text-xs hover:underline mt-6 uppercase">
            Already have an account? Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { reactive, inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const toast = inject('toast'); // Utilisation du système de toast d'App.vue

const form = reactive({
  username: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  const success = await authStore.register({ ...form });
  
  if (success) {
    toast('Compte créé avec succès ! Connectez-vous.', 'success');
    router.push('/login');
  } else {
    toast('Échec de l\'inscription', 'error');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>