<template>
  <div class="page">

    <!-- Full-page background -->
    <div class="bg-photo">
      <div class="bg-overlay"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-teal"></div>
      <div class="blob blob-sky"></div>
    </div>

    <!-- Content -->
    <div class="page-content">

      <!-- Page heading -->
      <div class="page-heading">
        <div class="heading-tag">✦ Gestion</div>
        <h1>Les <em>Auteurs</em></h1>
        <p>Administrez les auteurs enregistrés dans le catalogue</p>
      </div>

      <!-- Main card -->
      <div class="main-card">

        <!-- Add author section -->
        <div class="add-section">
          <div class="section-label">
            <span class="s-num">01</span> Ajouter un auteur
          </div>

          <div class="add-row">
            <div class="field">
              <label>Prénom <span class="req">*</span></label>
              <input
                v-model="newAuthor.prenom"
                type="text"
                placeholder="Ex: Victor"
              />
            </div>
            <div class="field">
              <label>Nom de famille <span class="req">*</span></label>
              <input
                v-model="newAuthor.nom"
                type="text"
                placeholder="Ex: Hugo"
              />
            </div>
            <div class="field field-btn">
              <label class="label-spacer">&nbsp;</label>
              <button @click="handleAddAuthor" class="btn-add">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
                </svg>
                Ajouter l'auteur
              </button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Table section -->
        <div class="table-section">
          <div class="table-header">
            <div class="section-label" style="margin-bottom:0">
              <span class="s-num">02</span> Liste des auteurs
            </div>
            <div class="count-pill">
              <span class="count-dot"></span>
              {{ authorsList.length }} enregistré{{ authorsList.length !== 1 ? 's' : '' }}
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width:56px">#</th>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th style="width:100px">Initiales</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="authorsList.length === 0">
                  <td colspan="4" class="empty-cell">
                    <div class="empty-state">
                      <span>📖</span>
                      <span>Aucun auteur enregistré</span>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="(auth, i) in authorsList"
                  :key="auth.id"
                  :style="{ '--i': i }"
                >
                  <td class="td-num">{{ String(i + 1).padStart(2, '0') }}</td>
                  <td class="td-prenom">{{ auth.prenom }}</td>
                  <td class="td-nom">{{ auth.nom }}</td>
                  <td>
                    <div class="avatar">
                      {{ (auth.prenom?.[0] ?? '').toUpperCase() }}{{ (auth.nom?.[0] ?? '').toUpperCase() }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authorService } from '@/services/api';

const authorsList = ref([]);
const newAuthor = ref({ prenom: '', nom: '' });

// Ajout d'un try/catch pour éviter que l'écran reste blanc en cas d'erreur
const loadAuthors = async () => {
  try {
    const res = await authorService.getAll();
    // Le backend NestJS renvoie souvent les données directement ou dans res.data
    // On s'assure de récupérer un tableau vide si rien n'est renvoyé
    authorsList.value = res.data || [];
  } catch (err) {
    console.error("Erreur de chargement des auteurs :", err);
    authorsList.value = [];
  }
};

const handleAddAuthor = async () => {
  // Petite validation avant d'envoyer
  if (!newAuthor.value.prenom || !newAuthor.value.nom) {
    alert("Veuillez remplir le prénom et le nom.");
    return;
  }

  try {
    await authorService.create(newAuthor.value);
    alert("Auteur ajouté avec succès !"); // Toujours bien pour confirmer pendant la démo
    newAuthor.value = { prenom: '', nom: '' }; // Reset
    await loadAuthors(); // Rafraîchir la liste
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    alert("Erreur lors de l'ajout de l'auteur.");
  }
};

onMounted(loadAuthors);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

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
  background-image: url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1800&auto=format&fit=crop&q=80');
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
  opacity: 0.3;
  animation: blobFloat 10s ease-in-out infinite alternate;
}
.blob-blue { width: 450px; height: 450px; background: #005da4; top: -120px; right: -80px; }
.blob-teal { width: 300px; height: 300px; background: #0ea5e9; bottom: -60px; left: 10%; animation-delay: -4s; }
.blob-sky  { width: 220px; height: 220px; background: #7dd3fc; top: 40%; left: -40px; animation-delay: -7s; }

@keyframes blobFloat {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(25px,-25px) scale(1.06); }
}

/* ── Page content ── */
.page-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background: rgba(186,230,253,0.12);
  border: 1px solid rgba(186,230,253,0.25);
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 14px;
}
.page-heading h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 10px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
}
.page-heading h1 em { font-style: italic; color: #bae6fd; }
.page-heading p { color: rgba(255,255,255,0.6); font-size: 0.9rem; font-weight: 300; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Main card ── */
.main-card {
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 24px;
  padding: 40px 48px;
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

/* Add section */
.add-section { }

.add-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field-btn { justify-content: flex-end; }
.label-spacer { visibility: hidden; font-size: 0.75rem; }

label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a5a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.req { color: #0094d9; }

input {
  width: 100%;
  background: rgba(240,248,255,0.6);
  border: 1.5px solid #c8dff0;
  border-radius: 10px;
  padding: 11px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #0c1a2e;
  transition: all 0.2s ease;
}
input::placeholder { color: #9ab8cf; }
input:focus {
  outline: none;
  border-color: #007cc3;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,124,195,0.12);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #005da4 0%, #0094d9 100%);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0,93,164,0.3);
  transition: all 0.25s;
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,93,164,0.4);
}

.divider { height: 1px; background: #e0edf7; margin: 28px 0; }

/* Table section */
.table-section { }
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.count-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.76rem;
  font-weight: 500;
  color: #3d5a7a;
  background: #e0f2fe;
  border-radius: 20px;
  padding: 4px 12px;
}
.count-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #0094d9;
}

.table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #d4e8f5; }

table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }

thead tr { background: #f0f8ff; }
thead th {
  padding: 12px 20px;
  text-align: left;
  font-size: 0.68rem;
  font-weight: 700;
  color: #5a80a0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-bottom: 1px solid #d4e8f5;
}

tbody tr {
  border-bottom: 1px solid #eaf3fb;
  transition: background 0.15s ease;
  animation: rowSlide 0.4s ease both;
  animation-delay: calc(var(--i) * 0.05s);
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #f0f8ff; }

@keyframes rowSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}

tbody td { padding: 13px 20px; color: #1e3a5a; }

.td-num {
  font-size: 0.7rem;
  color: #9ab8cf;
  font-weight: 700;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}
.td-prenom { color: #5a80a0; font-weight: 400; }
.td-nom    { font-weight: 600; color: #0c1a2e; }

.avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0,93,164,0.12), rgba(0,148,217,0.12));
  border: 1.5px solid rgba(0,124,195,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #007cc3;
  letter-spacing: 0.02em;
}

.empty-cell { padding: 52px 20px !important; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #9ab8cf;
  font-size: 0.88rem;
  font-size: 2rem;
}
.empty-state span:last-child { font-size: 0.88rem; }

@media (max-width: 700px) {
  .main-card { padding: 24px 18px; }
  .add-row { grid-template-columns: 1fr; }
  .btn-add { width: 100%; justify-content: center; }
}
</style>