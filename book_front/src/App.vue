<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
    
    <!-- On affiche la même Navbar pour tout le monde -->
    <!-- C'est à l'intérieur de Navbar.vue qu'on gérera l'affichage Admin/User -->
    <Navbar />

    <main class="flex-grow flex flex-col">
      <router-view :key="$route.fullPath"></router-view>
    </main>

    <!-- Système de Toasts -->
    <Teleport to="body">
      <div class="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <TransitionGroup name="toast">
          <div
            v-for="t in toasts"
            :key="t.id"
            class="flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl bg-white border-l-4 border-[#007cc3] pointer-events-auto shadow-[#007cc3]/10"
          >
            <span class="text-sm font-semibold text-gray-800">{{ t.message }}</span>
            <button @click="removeToast(t.id)" class="ml-auto text-gray-300">✕</button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Navbar from '@/components/Navbar.vue' // Le seul import dont tu as besoin

// TOAST SYSTEM
const toasts = ref([])
let counter = 0

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

provide('toast', (message) => {
  const id = ++counter
  toasts.value.push({ id, message })
  setTimeout(() => removeToast(id), 4000)
})
</script>