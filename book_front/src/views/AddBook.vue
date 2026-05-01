<template>
  <div class="page">

    <!-- Full-page background photo -->
    <div class="bg-photo">
      <div class="bg-overlay"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-cyan"></div>
      <div class="blob blob-sky"></div>
    </div>

    <!-- Centered content -->
    <div class="page-content">

      <!-- Page title above form -->
      <div class="page-heading">
        <div class="heading-tag">✦ Catalogue</div>
        <h1>Ajouter un <em>nouveau livre</em></h1>
        <p>Remplissez les champs pour enrichir la collection.</p>
      </div>

      <!-- Wide centered form card -->
      <div class="form-card">

        <form @submit.prevent="handleSubmit">

          <!-- Section 1 -->
          <div class="section-label">
            <span class="s-num">01</span> Informations générales
          </div>

          <div class="grid-3">
            <div class="field">
              <label>Titre <span class="req">*</span></label>
              <input v-model="book.title" type="text" placeholder="Ex: Le Petit Prince" required />
            </div>
            <div class="field">
              <label>Éditeur</label>
              <input v-model="book.editor" type="text" placeholder="Ex: Gallimard" />
            </div>
            <div class="field">
              <label>Année de publication</label>
              <input v-model.number="book.year" type="number" placeholder="2024" />
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label>Auteur <span class="req">*</span></label>
              <div class="select-wrap">
                <select v-model.number="book.authorId" required>
  <option disabled value="">Sélectionner un auteur...</option>
  <option v-for="author in authors" :key="author.id" :value="author.id">
    <!-- Correction ici : on utilise les vraies clés de ton JSON -->
    {{ author.prenom }} {{ author.nom }}
  </option>
</select>
                <svg class="sel-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <div class="field">
              <label>URL de la couverture</label>
              <input v-model="book.image" type="text" placeholder="https://example.com/cover.jpg" />
            </div>
          </div>

          <div class="divider"></div>

          <!-- Section 2 -->
          <div class="section-label">
            <span class="s-num">02</span> Description
          </div>

          <div class="field">
            <label>Résumé du livre</label>
            <textarea v-model="book.description" rows="4" placeholder="Présentez le livre en quelques phrases..."></textarea>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-ghost" @click="$router.push('/books')">
              ← Annuler
            </button>
            <button type="submit" class="btn-main" :disabled="loading">
              {{ loading ? 'Enregistrement...' : 'Confirmer l\'ajout →' }}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookService, authorService } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const authors = ref([]);

const book = ref({
  title: '',
  image: '',
  editor: '',
  year: null,
  description: '',
  authorId: null
});

onMounted(async () => {
  try {
    const response = await authorService.getAll();
    authors.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des auteurs", error);
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await bookService.create(book.value);
    alert('Livre ajouté avec succès !');
    router.push('/books');
  } catch (error) {
    alert("Erreur lors de l'ajout. Vérifiez les données.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* Palette — aligned with navbar #005da4 → #0094d9 */
:root {
  --blue-dark:  #005da4;
  --blue-mid:   #007cc3;
  --blue-light: #0094d9;
  --blue-pale:  #e0f2fe;
  --accent:     #38bdf8;
  --text-dark:  #0c1a2e;
  --text-mid:   #3d5a7a;
  --text-soft:  #7a96b0;
}

.page {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* ── Background ── */
.bg-photo {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(0, 93, 164, 0.82) 0%,
    rgba(0, 124, 195, 0.72) 35%,
    rgba(0, 148, 217, 0.65) 60%,
    rgba(56, 189, 248, 0.55) 100%
  );
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: blobFloat 10s ease-in-out infinite alternate;
}
.blob-blue  { width: 500px; height: 500px; background: #005da4; top: -150px; left: -100px; animation-delay: 0s; }
.blob-cyan  { width: 320px; height: 320px; background: #38bdf8; bottom: -80px; right: 5%; animation-delay: -4s; }
.blob-sky   { width: 260px; height: 260px; background: #7dd3fc; top: 45%; right: 20%; animation-delay: -7s; }

@keyframes blobFloat {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(30px,-30px) scale(1.07); }
}

/* ── Page content ── */
.page-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 64px;
}

/* ── Heading ── */
.page-heading {
  text-align: center;
  margin-bottom: 32px;
  animation: fadeUp 0.6s ease both;
}

.heading-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #bae6fd;
  background: rgba(186, 230, 253, 0.12);
  border: 1px solid rgba(186, 230, 253, 0.25);
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 16px;
}

.page-heading h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 10px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
}
.page-heading h1 em {
  font-style: italic;
  color: #bae6fd;
}
.page-heading p {
  color: rgba(255,255,255,0.6);
  font-size: 0.92rem;
  font-weight: 300;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Form card ── */
.form-card {
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 24px;
  padding: 44px 52px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.05),
    0 24px 64px rgba(0, 93, 164, 0.2);
  animation: fadeUp 0.6s 0.1s ease both;
}

/* Section labels */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #3d5a7a;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 20px;
}
.s-num {
  font-size: 0.62rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #005da4, #0094d9);
  border-radius: 6px;
  padding: 2px 7px;
  letter-spacing: 0.06em;
}

.divider { height: 1px; background: #e0edf7; margin: 28px 0; }

/* Grids */
.grid-3 {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 6px; }

label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a5a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.req { color: #0094d9; }

input, textarea, select {
  width: 100%;
  background: rgba(240, 248, 255, 0.6);
  border: 1.5px solid #c8dff0;
  border-radius: 10px;
  padding: 11px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #0c1a2e;
  transition: all 0.2s ease;
}
input::placeholder, textarea::placeholder { color: #9ab8cf; }
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #007cc3;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 124, 195, 0.12);
}
textarea { resize: vertical; min-height: 110px; line-height: 1.6; }

.select-wrap { position: relative; }
select { appearance: none; cursor: pointer; padding-right: 34px; }
.sel-arrow {
  position: absolute;
  right: 10px; top: 50%;
  transform: translateY(-50%);
  width: 14px; color: #7a96b0;
  pointer-events: none;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid #e0edf7;
}

.btn-ghost {
  padding: 11px 22px;
  border-radius: 10px;
  border: 1.5px solid #c8dff0;
  background: transparent;
  color: #3d5a7a;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { background: rgba(0,93,164,0.06); border-color: #007cc3; }

.btn-main {
  padding: 11px 32px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #005da4 0%, #0094d9 100%);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 93, 164, 0.35);
  transition: all 0.25s;
  letter-spacing: 0.01em;
}
.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 93, 164, 0.4);
}
.btn-main:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

@media (max-width: 768px) {
  .form-card { padding: 28px 22px; }
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .btn-ghost, .btn-main { width: 100%; text-align: center; justify-content: center; }
}
</style>