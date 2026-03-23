<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { user, logout, changePassword, isAuthenticated } from '../stores/auth'
import {
  adminEvent,
  adminLinks,
  adminStreamers,
  adminLoading,
  fetchAdminEvent,
  updateAdminEvent,
  fetchAdminLinks,
  updateAdminLinks,
  fetchAdminStreamers,
  addAdminStreamer,
  deleteAdminStreamer,
} from '../stores/admin'

const router = useRouter()

// Formulaires
const linksForm = ref({ ...adminLinks.value })
const newStreamer = ref('')
const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})
const passwordMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Navigation
const activeTab = ref<'dashboard' | 'links' | 'streamers' | 'account'>('dashboard')
const sidebarOpen = ref(false)

// Stats
const stats = computed(() => ({
  streamers: adminStreamers.value.length,
  links: Object.values(adminLinks.value).filter(Boolean).length,
}))

// Charger les données
onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  await Promise.all([fetchAdminEvent(), fetchAdminLinks(), fetchAdminStreamers()])
  linksForm.value = { ...adminLinks.value }
})

// Actions
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const handleToggleEvent = async () => {
  await updateAdminEvent(!adminEvent.value)
}

const handleSaveLinks = async () => {
  const success = await updateAdminLinks(linksForm.value)
  if (success) {
    saveMessage.value = { type: 'success', text: 'Liens sauvegardés !' }
    setTimeout(() => saveMessage.value = null, 3000)
  }
}

const handleAddStreamer = async () => {
  if (!newStreamer.value.trim()) return
  const success = await addAdminStreamer(newStreamer.value.trim())
  if (success) {
    newStreamer.value = ''
  }
}

const handleDeleteStreamer = async (name: string) => {
  if (confirm(`Supprimer ${name} ?`)) {
    await deleteAdminStreamer(name)
  }
}

const handleChangePassword = async () => {
  passwordMessage.value = null

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordMessage.value = { type: 'error', text: 'Les mots de passe ne correspondent pas' }
    return
  }

  if (passwordForm.value.new.length < 4) {
    passwordMessage.value = { type: 'error', text: 'Minimum 4 caractères' }
    return
  }

  const result = await changePassword(passwordForm.value.current, passwordForm.value.new)
  if (result.success) {
    passwordMessage.value = { type: 'success', text: 'Mot de passe modifié !' }
    passwordForm.value = { current: '', new: '', confirm: '' }
  } else {
    passwordMessage.value = { type: 'error', text: result.error || 'Erreur' }
  }
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { id: 'links', label: 'Liens', icon: 'fas fa-link' },
  { id: 'streamers', label: 'Streamers', icon: 'fab fa-twitch' },
  { id: 'account', label: 'Compte', icon: 'fas fa-user' },
]
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <img src="/img/rplaceFR-Logo.webp" alt="r/placeFR" class="sidebar-logo" />
        <span class="sidebar-title">Admin</span>
      </div>

      <nav class="sidebar-nav">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          :class="{ active: activeTab === item.id }" 
          @click="activeTab = item.id as typeof activeTab; sidebarOpen = false"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <RouterLink to="/" class="back-link">
          <i class="fas fa-arrow-left"></i>
          <span>Retour au site</span>
        </RouterLink>
        <button @click="handleLogout" class="logout-link">
          <i class="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="page-title">
          {{ navItems.find(i => i.id === activeTab)?.label }}
        </h1>
        <div class="user-badge">
          <i class="fas fa-user-circle"></i>
          <span>{{ user?.username }}</span>
        </div>
      </header>

      <!-- Content -->
      <div class="content-area">
        <!-- Loading -->
        <div v-if="adminLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
        </div>

        <!-- Dashboard -->
        <template v-else-if="activeTab === 'dashboard'">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card" :class="adminEvent ? 'success' : 'danger'">
              <div class="stat-icon">
                <i :class="adminEvent ? 'fas fa-check' : 'fas fa-times'"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ adminEvent ? 'Actif' : 'Inactif' }}</span>
                <span class="stat-label">Événement</span>
              </div>
            </div>
            <div class="stat-card purple">
              <div class="stat-icon">
                <i class="fab fa-twitch"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.streamers }}</span>
                <span class="stat-label">Streamers</span>
              </div>
            </div>
            <div class="stat-card blue">
              <div class="stat-icon">
                <i class="fas fa-link"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.links }}/5</span>
                <span class="stat-label">Liens configurés</span>
              </div>
            </div>
          </div>

          <!-- Event Toggle Card -->
          <div class="card">
            <div class="card-header">
              <h2><i class="fas fa-power-off"></i> Contrôle de l'événement</h2>
            </div>
            <div class="card-body">
              <div class="event-control">
                <div class="event-info">
                  <div class="event-badge" :class="adminEvent ? 'active' : 'inactive'">
                    <i :class="adminEvent ? 'fas fa-circle' : 'far fa-circle'"></i>
                    {{ adminEvent ? 'r/place en cours' : 'r/place terminé' }}
                  </div>
                  <p>Basculez l'état pour changer le mode du site</p>
                </div>
                <button @click="handleToggleEvent" class="toggle-event-btn" :class="{ off: adminEvent }">
                  <i :class="adminEvent ? 'fas fa-stop' : 'fas fa-play'"></i>
                  {{ adminEvent ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h2><i class="fas fa-bolt"></i> Accès rapide</h2>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button @click="activeTab = 'links'" class="quick-btn">
                  <i class="fas fa-link"></i>
                  Gérer les liens
                </button>
                <button @click="activeTab = 'streamers'" class="quick-btn purple">
                  <i class="fab fa-twitch"></i>
                  Gérer les streamers
                </button>
                <a :href="adminLinks.discord" target="_blank" class="quick-btn discord">
                  <i class="fab fa-discord"></i>
                  Ouvrir Discord
                </a>
              </div>
            </div>
          </div>
        </template>

        <!-- Links -->
        <template v-else-if="activeTab === 'links'">
          <div class="card">
            <div class="card-header">
              <h2><i class="fas fa-link"></i> Configuration des liens</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSaveLinks" class="links-form">
                <div class="form-row">
                  <label><i class="fab fa-discord"></i> Discord</label>
                  <input type="url" v-model="linksForm.discord" placeholder="https://discord.gg/..." />
                </div>
                <div class="form-row">
                  <label><i class="fab fa-reddit-alien"></i> Reddit</label>
                  <input type="url" v-model="linksForm.reddit" placeholder="https://reddit.com/r/..." />
                </div>
                <div class="form-row">
                  <label><i class="fas fa-book"></i> Tutoriel</label>
                  <input type="url" v-model="linksForm.tuto" placeholder="https://..." />
                </div>
                <div class="form-row">
                  <label><i class="fas fa-map"></i> Atlas</label>
                  <input type="url" v-model="linksForm.atlas" placeholder="https://..." />
                </div>
                <div class="form-row">
                  <label><i class="fas fa-handshake"></i> Relations</label>
                  <input type="url" v-model="linksForm.relations" placeholder="https://..." />
                </div>

                <div v-if="saveMessage" :class="['alert', saveMessage.type]">
                  <i :class="saveMessage.type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'"></i>
                  {{ saveMessage.text }}
                </div>

                <button type="submit" class="btn-primary">
                  <i class="fas fa-save"></i> Sauvegarder
                </button>
              </form>
            </div>
          </div>
        </template>

        <!-- Streamers -->
        <template v-else-if="activeTab === 'streamers'">
          <div class="card">
            <div class="card-header">
              <h2><i class="fab fa-twitch"></i> Streamers ({{ adminStreamers.length }})</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleAddStreamer" class="add-form">
                <input type="text" v-model="newStreamer" placeholder="Nom du streamer Twitch..." />
                <button type="submit" :disabled="!newStreamer.trim()">
                  <i class="fas fa-plus"></i>
                </button>
              </form>

              <div class="streamers-list" v-if="adminStreamers.length > 0">
                <div v-for="streamer in adminStreamers" :key="streamer" class="streamer-row">
                  <div class="streamer-info">
                    <i class="fab fa-twitch"></i>
                    <a :href="`https://twitch.tv/${streamer}`" target="_blank">{{ streamer }}</a>
                  </div>
                  <button @click="handleDeleteStreamer(streamer)" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="fab fa-twitch"></i>
                <p>Aucun streamer</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Account -->
        <template v-else-if="activeTab === 'account'">
          <div class="card">
            <div class="card-header">
              <h2><i class="fas fa-user"></i> Mon compte</h2>
            </div>
            <div class="card-body">
              <div class="profile-info">
                <div class="avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="profile-details">
                  <h3>{{ user?.username }}</h3>
                  <span class="role-badge">
                    <i class="fas fa-shield-alt"></i> Administrateur
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2><i class="fas fa-key"></i> Changer le mot de passe</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleChangePassword" class="password-form">
                <div class="form-row">
                  <label>Mot de passe actuel</label>
                  <input type="password" v-model="passwordForm.current" required />
                </div>
                <div class="form-row">
                  <label>Nouveau mot de passe</label>
                  <input type="password" v-model="passwordForm.new" required />
                </div>
                <div class="form-row">
                  <label>Confirmer</label>
                  <input type="password" v-model="passwordForm.confirm" required />
                </div>

                <div v-if="passwordMessage" :class="['alert', passwordMessage.type]">
                  <i :class="passwordMessage.type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'"></i>
                  {{ passwordMessage.text }}
                </div>

                <button type="submit" class="btn-primary">
                  <i class="fas fa-lock"></i> Modifier
                </button>
              </form>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--gray-100);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-logo {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.7);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
}

.sidebar-nav button:hover {
  background: rgba(255,255,255,0.1);
  color: var(--white);
}

.sidebar-nav button.active {
  background: var(--accent);
  color: var(--white);
}

.sidebar-nav button i {
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar-footer a,
.sidebar-footer button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  border-radius: var(--radius);
  transition: all 0.2s;
  font-size: 0.9rem;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar-footer a:hover,
.sidebar-footer button:hover {
  background: rgba(255,255,255,0.1);
  color: var(--white);
}

.sidebar-overlay {
  display: none;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
}

.menu-toggle {
  display: none;
  padding: var(--space-2);
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--gray-600);
}

.page-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--gray-100);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  color: var(--gray-600);
}

.content-area {
  padding: var(--space-6);
  flex: 1;
}

/* Loading */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 2rem;
  color: var(--accent);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-size: 1.25rem;
}

.stat-card.success .stat-icon { background: #dcfce7; color: #16a34a; }
.stat-card.danger .stat-icon { background: #fee2e2; color: #dc2626; }
.stat-card.purple .stat-icon { background: #f3e8ff; color: #9333ea; }
.stat-card.blue .stat-icon { background: #dbeafe; color: #2563eb; }

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--gray-500);
}

/* Cards */
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: var(--space-5);
  overflow: hidden;
}

.card-header {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--gray-100);
}

.card-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card-header h2 i {
  color: var(--accent);
}

.card-body {
  padding: var(--space-5);
}

/* Event Control */
.event-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9rem;
}

.event-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.event-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.event-badge i {
  font-size: 0.6rem;
}

.event-info p {
  margin: var(--space-2) 0 0;
  color: var(--gray-500);
  font-size: 0.9rem;
}

.toggle-event-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  background: var(--success);
  color: var(--white);
  transition: all 0.2s;
}

.toggle-event-btn.off {
  background: var(--danger);
}

.toggle-event-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  background: var(--white);
  color: var(--gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.quick-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.quick-btn.purple:hover { border-color: #9333ea; color: #9333ea; }
.quick-btn.discord:hover { border-color: var(--discord); color: var(--discord); }

/* Forms */
.form-row {
  margin-bottom: var(--space-4);
}

.form-row label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.form-row label i {
  color: var(--accent);
  width: 16px;
}

.form-row input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-row input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: none;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--white);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.alert.success {
  background: #dcfce7;
  color: #16a34a;
}

.alert.error {
  background: #fee2e2;
  color: #dc2626;
}

/* Add Form */
.add-form {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.add-form input {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
}

.add-form input:focus {
  outline: none;
  border-color: var(--twitch);
}

.add-form button {
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius);
  background: var(--twitch);
  color: var(--white);
  cursor: pointer;
  transition: all 0.2s;
}

.add-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-form button:not(:disabled):hover {
  background: #7c3aed;
}

/* Streamers List */
.streamers-list {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  max-height: 350px;
  overflow-y: auto;
}

.streamer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
}

.streamer-row:last-child {
  border-bottom: none;
}

.streamer-row:hover {
  background: var(--gray-50);
}

.streamer-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.streamer-info i {
  color: var(--twitch);
}

.streamer-info a {
  color: var(--gray-800);
  font-weight: 500;
}

.streamer-info a:hover {
  color: var(--twitch);
}

.delete-btn {
  padding: var(--space-2);
  border: none;
  background: transparent;
  color: var(--gray-400);
  cursor: pointer;
  border-radius: var(--radius);
  transition: all 0.2s;
}

.delete-btn:hover {
  background: var(--danger);
  color: var(--white);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--gray-400);
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
}

/* Profile */
.profile-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.avatar {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: var(--white);
  border-radius: 50%;
  font-size: 1.5rem;
}

.profile-details h3 {
  margin: 0 0 var(--space-1);
  font-size: 1.25rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--accent);
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.password-form {
  max-width: 400px;
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: 99;
  }

  .sidebar-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  .main-content {
    margin-left: 0;
  }

  .menu-toggle {
    display: block;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .event-control {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
