<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const router = useRouter()

if (isAuthenticated.value) {
  router.push('/admin')
}

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const isFormValid = computed(
  () =>
    username.value.length >= 3 &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value,
)

const handleSubmit = async () => {
  error.value = null

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.detail || "Erreur lors de l'inscription"
      return
    }

    success.value = true
  } catch {
    error.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-background">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>

    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/img/rplaceFR-Logo.webp" alt="r/placeFR" class="logo" />
          <h1>Inscription</h1>
          <p class="subtitle">Créez un compte (validation requise par un admin)</p>
        </div>

        <!-- Succès -->
        <div v-if="success" class="success-box">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Demande envoyée !</strong>
            <p>Votre compte est en attente de validation par un administrateur.</p>
          </div>
          <RouterLink to="/login" class="login-button" style="margin-top: 1rem; text-decoration: none; text-align: center; display: block;">
            <i class="fas fa-sign-in-alt"></i> Retour à la connexion
          </RouterLink>
        </div>

        <!-- Formulaire -->
        <form v-else @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i>
              Nom d'utilisateur
            </label>
            <div class="input-wrapper">
              <input
                type="text"
                id="username"
                v-model="username"
                required
                minlength="3"
                autocomplete="username"
                :disabled="loading"
                placeholder="Minimum 3 caractères"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i>
              Mot de passe
            </label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                minlength="6"
                autocomplete="new-password"
                :disabled="loading"
                placeholder="Minimum 6 caractères"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Masquer' : 'Afficher'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm">
              <i class="fas fa-lock"></i>
              Confirmer le mot de passe
            </label>
            <div class="input-wrapper">
              <input
                type="password"
                id="confirm"
                v-model="confirmPassword"
                required
                autocomplete="new-password"
                :disabled="loading"
                placeholder="Répétez votre mot de passe"
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <button type="submit" :disabled="loading || !isFormValid" class="login-button">
            <template v-if="loading">
              <i class="fas fa-circle-notch fa-spin"></i>
              Envoi...
            </template>
            <template v-else>
              <i class="fas fa-user-plus"></i>
              S'inscrire
            </template>
          </button>
        </form>

        <div class="back-link">
          <RouterLink to="/login">
            <i class="fas fa-arrow-left"></i>
            Retour à la connexion
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: var(--space-4);
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  filter: blur(60px);
}

.bg-shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.bg-shape-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  animation: float 6s ease-in-out infinite reverse;
}

.bg-shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  animation: float 10s ease-in-out infinite;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: var(--white);
  padding: var(--space-10);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: fadeInUp 0.5s ease;
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto var(--space-4);
  display: block;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: float 4s ease-in-out infinite;
}

.login-header h1 {
  font-size: 1.75rem;
  color: var(--primary);
  margin: 0 0 var(--space-2);
}

.subtitle {
  color: var(--gray-500);
  font-size: 0.9rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.form-group label i {
  color: var(--accent);
}

.input-wrapper {
  position: relative;
}

.form-group input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: all var(--transition-fast);
  background: var(--gray-50);
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-group input:disabled {
  background-color: var(--gray-100);
  cursor: not-allowed;
}

.password-toggle {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--space-1);
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--gray-600);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: var(--danger);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #16a34a;
  padding: var(--space-5);
  border-radius: var(--radius);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.success-box i {
  font-size: 2rem;
  text-align: center;
}

.success-box p {
  margin: var(--space-1) 0 0;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
  color: var(--white);
  border: none;
  padding: var(--space-4);
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.back-link {
  margin-top: var(--space-6);
  text-align: center;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--gray-500);
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.back-link a:hover {
  color: var(--accent);
}
</style>
