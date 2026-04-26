<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
    
    <Navbar />

    <main class="flex-grow flex flex-col">
      <router-view :key="$route.fullPath"></router-view>
    </main>

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
import Navbar from '@/components/Navbar.vue'

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

<style>
/* Animation légère pour les toasts uniquement */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }

/* On s'assure que le body prend toute la hauteur */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>