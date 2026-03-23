<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BannerSection from '../components/BannerSection.vue'
import { eventActive } from '../stores/app'

const router = useRouter()

// Redirection si event inactif
onMounted(() => {
  if (!eventActive.value) {
    router.replace('/')
  }
})

watch(eventActive, (active) => {
  if (!active) {
    router.replace('/')
  }
})

interface SeasonTimer {
  name: string
  id: string
  icon: string
  gradient: string
  time: number
  running: boolean
  interval: ReturnType<typeof setInterval> | null
}

const seasons = ref<SeasonTimer[]>([
  { name: 'Hiver', id: 'hiver', icon: 'fas fa-snowflake', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', time: 300000, running: false, interval: null },
  { name: 'Printemps', id: 'printemps', icon: 'fas fa-leaf', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', time: 300000, running: false, interval: null },
  { name: 'Été', id: 'ete', icon: 'fas fa-sun', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', time: 300000, running: false, interval: null },
  { name: 'Automne', id: 'automne', icon: 'fas fa-wind', gradient: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)', time: 300000, running: false, interval: null }
])

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const startTimer = (season: SeasonTimer) => {
  if (season.running) return
  
  season.running = true
  season.interval = setInterval(() => {
    season.time -= 1000
    
    if (season.time <= 0) {
      if (season.interval) clearInterval(season.interval)
      season.time = 300000
      season.running = false
    }
  }, 1000)
}

const resetTimer = (season: SeasonTimer) => {
  if (season.interval) clearInterval(season.interval)
  season.time = 300000
  season.running = false
}
</script>

<template>
  <main>
    <BannerSection />
    
    <section class="organisation-section">
      <div class="section-header">
        <i class="fas fa-clock section-icon"></i>
        <h1 class="gradient-text">Organisation</h1>
        <p>Gérez les rotations de saisons pour l'événement r/place</p>
      </div>
      
      <div class="timers-grid">
        <article 
          v-for="season in seasons" 
          :key="season.id" 
          class="timer-card"
          :class="{ running: season.running }"
        >
          <div 
            class="timer-header"
            :style="{ background: season.gradient }"
            @click="startTimer(season)"
          >
            <i :class="season.icon" class="season-icon"></i>
            <h2>{{ season.name }}</h2>
            <span v-if="!season.running" class="click-hint">
              <i class="fas fa-play"></i>
              Cliquer pour démarrer
            </span>
            <span v-else class="running-indicator">
              <i class="fas fa-circle pulse"></i>
              En cours
            </span>
          </div>
          
          <div class="timer-body">
            <div class="timer-display">
              <i class="far fa-clock"></i>
              <span class="time">{{ formatTime(season.time) }}</span>
            </div>
            
            <div class="timer-progress">
              <div 
                class="progress-bar" 
                :style="{ 
                  width: `${(season.time / 300000) * 100}%`,
                  background: season.gradient 
                }"
              ></div>
            </div>
            
            <button 
              v-if="season.running" 
              @click.stop="resetTimer(season)" 
              class="reset-btn"
            >
              <i class="fas fa-redo-alt"></i>
              Réinitialiser
            </button>
          </div>
        </article>
      </div>
      
      <div class="info-card">
        <i class="fas fa-info-circle"></i>
        <div>
          <h3>Comment utiliser les timers ?</h3>
          <p>Cliquez sur une saison pour démarrer son timer de 5 minutes. Chaque saison représente une rotation dans l'organisation de r/place.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.organisation-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-4);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-icon {
  font-size: 3rem;
  color: var(--accent);
  margin-bottom: var(--space-4);
  display: block;
  text-align: center;
  width: 100%;
}

.section-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: var(--space-4);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.timers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

@media (max-width: 1024px) {
  .timers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .timers-grid {
    grid-template-columns: 1fr;
  }
}

.timer-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
}

.timer-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.timer-card.running {
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
}

.timer-header {
  padding: var(--space-8);
  color: var(--white);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.timer-card.running .timer-header {
  filter: grayscale(0.3);
  cursor: default;
}

.season-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
  display: block;
  text-align: center;
  width: 100%;
  animation: float 3s ease-in-out infinite;
}

.timer-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
}

.click-hint, .running-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  font-size: 0.85rem;
  opacity: 0.9;
}

.click-hint {
  font-weight: 500;
}

.running-indicator {
  font-weight: 600;
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
  font-size: 0.6rem;
}

.timer-body {
  padding: var(--space-6);
  text-align: center;
}

.timer-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.timer-display i {
  font-size: 1.5rem;
  color: var(--gray-400);
}

.time {
  font-size: 3rem;
  font-weight: 800;
  color: var(--gray-900);
  font-variant-numeric: tabular-nums;
}

.timer-progress {
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s linear;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-full);
  color: var(--gray-600);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  background: var(--gray-200);
  color: var(--gray-900);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-6);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-lg);
}

.info-card > i {
  font-size: 1.5rem;
  color: var(--accent);
  flex-shrink: 0;
}

.info-card h3 {
  margin: 0 0 var(--space-2);
  font-size: 1.1rem;
  color: var(--gray-900);
}

.info-card p {
  margin: 0;
  color: var(--gray-600);
  line-height: 1.6;
}

@media screen and (max-width: 768px) {
  .section-header h1 {
    font-size: 2rem;
  }
  
  .time {
    font-size: 2.5rem;
  }
  
  .timer-header {
    padding: var(--space-6);
  }
  
  .season-icon {
    font-size: 2.5rem;
  }
}
</style>
