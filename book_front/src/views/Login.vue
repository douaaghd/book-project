<template>
  <div class="page">

    <!-- Full-page background photo -->
    <div class="bg-photo">
      <div class="bg-overlay"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-cyan"></div>
      <div class="blob blob-sky"></div>
    </div>

    <!-- Centered card -->
    <div class="page-content">

      <!-- Logo / Brand -->
      <div class="brand">
        <span class="brand-icon">📚</span>
        <span class="brand-name">BookShop</span>
      </div>

      <div class="login-card">

        <!-- Heading -->
        <div class="card-heading">
          <div class="heading-tag">✦ Espace membre</div>
          <h1>Bon retour <em>parmi nous</em></h1>
          <p>Connectez-vous pour accéder à votre collection.</p>
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="error-banner">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" style="flex-shrink:0">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
          </svg>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="onLogin">

          <div class="field">
            <label>Email</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/>
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/>
              </svg>
              <input
                v-model="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div class="field">
            <label>Mot de passe</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/>
              </svg>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-main" :disabled="isLoading">
            <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
            <svg v-if="!isLoading" viewBox="0 0 20 20" fill="currentColor" width="16">
              <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/>
            </svg>
          </button>

          <div class="register-link">
            Pas encore de compte ?
            <router-link to="/register">Créer un compte</router-link>
          </div>

        </form>
      </div>
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
    // 1. Appel au store
    const success = await authStore.login({
      username: email.value,
      password: password.value
    })

    if (success) {
      // RÉCUPÉRATION DU RÔLE DEPUIS LE STORE (mis à jour par login)
      const role = authStore.user?.role?.toUpperCase() || ''
      console.log("LOGIN RÉUSSI - Rôle:", role)

      // 2. REDIRECTION ET RECHARGEMENT FORCÉ
      // Utiliser window.location.href au lieu de router.push 
      // garantit que Pinia et la Navbar redémarrent à zéro avec les bonnes données.
      if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
        window.location.href = '/admin' // Ou ton chemin admin
      } else {
        window.location.href = '/home'
      }
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
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
    rgba(0, 93, 164, 0.84) 0%,
    rgba(0, 124, 195, 0.74) 40%,
    rgba(0, 148, 217, 0.66) 65%,
    rgba(56, 189, 248, 0.56) 100%
  );
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: blobFloat 10s ease-in-out infinite alternate;
}
.blob-blue { width: 500px; height: 500px; background: #005da4; top: -160px; left: -100px; animation-delay: 0s; }
.blob-cyan { width: 320px; height: 320px; background: #38bdf8; bottom: -80px; right: 5%; animation-delay: -4s; }
.blob-sky  { width: 240px; height: 240px; background: #7dd3fc; top: 50%; right: 20%; animation-delay: -7s; }

@keyframes blobFloat {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(28px,-28px) scale(1.07); }
}

/* ── Page content ── */
.page-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 40px 24px;
  width: 100%;
  animation: fadeUp 0.65s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Brand ── */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}
.brand-icon { font-size: 1.5rem; }
.brand-name {
  font-family: 'Fraunces', serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

/* ── Login card ── */
.login-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 24px;
  padding: 44px 48px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.05),
    0 24px 64px rgba(0, 93, 164, 0.22);
}

/* ── Card heading ── */
.card-heading { margin-bottom: 32px; }

.heading-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #007cc3;
  background: rgba(0,124,195,0.08);
  border: 1px solid rgba(0,124,195,0.18);
  border-radius: 20px;
  padding: 4px 13px;
  margin-bottom: 14px;
}

.card-heading h1 {
  font-family: 'Fraunces', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #0c1a2e;
  line-height: 1.12;
  margin-bottom: 8px;
}
.card-heading h1 em {
  font-style: italic;
  color: #007cc3;
}
.card-heading p {
  color: #6b8aaa;
  font-size: 0.88rem;
  font-weight: 300;
}

/* ── Error banner ── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #b91c1c;
  margin-bottom: 20px;
}

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
}

label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a5a;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.input-wrap { position: relative; }

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  color: #9ab8cf;
  pointer-events: none;
}

input {
  width: 100%;
  background: rgba(240, 248, 255, 0.6);
  border: 1.5px solid #c8dff0;
  border-radius: 10px;
  padding: 12px 14px 12px 40px;
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
  box-shadow: 0 0 0 3px rgba(0, 124, 195, 0.12);
}

/* ── Submit button ── */
.btn-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 28px;
  padding: 13px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #005da4 0%, #0094d9 100%);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 16px rgba(0, 93, 164, 0.35);
  transition: all 0.25s ease;
}
.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 93, 164, 0.42);
}
.btn-main:active { transform: translateY(0); }
.btn-main:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

/* ── Register link ── */
.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.82rem;
  color: #7a96b0;
  font-weight: 300;
}
.register-link a {
  color: #007cc3;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.2s;
}
.register-link a:hover { color: #005da4; text-decoration: underline; }

/* ── Fade transition (kept from original) ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 500px) {
  .login-card { padding: 32px 22px; }
  .card-heading h1 { font-size: 1.6rem; }
}
</style>