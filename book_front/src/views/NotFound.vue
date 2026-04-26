<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-slate-50">
    <div class="text-center max-w-md animate-slide-up">
      <div class="relative inline-block mb-6">
        <span class="font-sans text-[9rem] font-black text-slate-100 leading-none select-none">404</span>
        <span class="absolute inset-0 flex items-center justify-center text-5xl">📚</span>
      </div>
      <h1 class="text-3xl font-bold text-slate-900 mb-3">Page introuvable</h1>
      <p class="text-slate-500 mb-8 leading-relaxed">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="$router.back()" class="btn-secondary">← Retour</button>
        <RouterLink to="/" class="btn-primary">🏠 Accueil</RouterLink>
      </div>
    </div>
  </div>
</template>
