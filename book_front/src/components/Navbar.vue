<template>
  <nav class="w-full h-16 bg-gradient-to-r from-[#005da4] via-[#007cc3] to-[#0094d9] text-white px-12 flex items-center justify-between shadow-lg z-50">
    <router-link to="/" class="text-2xl font-bold tracking-tight">
      Bookstore
    </router-link>

    <div class="flex items-center gap-10 text-[12px] font-bold tracking-[0.2em] uppercase">
      <router-link to="/" class="hover:text-blue-200 transition-colors">Home</router-link>
      <router-link to="/login" class="hover:text-blue-200 transition-colors">Login</router-link>
    </div>
  </nav>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const hideNavbar = computed(() => ['login', 'register'].includes(route.name))
</script>