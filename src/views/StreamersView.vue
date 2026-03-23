<script setup lang="ts">
import { onMounted } from 'vue'
import BannerSection from '../components/BannerSection.vue'
import StreamerCard from '../components/StreamerCard.vue'
import { eventActive, sortedStreamers, streamersLoading, fetchStreamers, fetchConfig } from '../stores/app'

onMounted(() => {
  fetchConfig()
  fetchStreamers()
})
</script>

<template>
  <main>
    <BannerSection />
    
    <section class="streamers-section">
      <div class="section-header">
        <i class="fab fa-twitch section-icon"></i>
        <h2 v-if="eventActive">
          <span class="gradient-text">Streams en direct</span>
        </h2>
        <h2 v-else>
          <span class="gradient-text">Nos Streamers</span>
        </h2>
        
        <p v-if="eventActive">
          Rejoins les streamers français qui défendent notre art sur r/place !
        </p>
        <p v-else>
          Découvre les streamers qui ont participé à l'aventure r/place.
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="streamersLoading" class="loading-container">
        <div class="loading-spinner">
          <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>Chargement des streamers...</p>
      </div>
      
      <!-- Streamers Grid -->
      <div v-else class="streamers-grid">
        <StreamerCard 
          v-for="(streamer, index) in sortedStreamers" 
          :key="streamer.name" 
          :streamer="streamer"
          :style="{ animationDelay: `${index * 50}ms` }"
          class="streamer-item"
        />
      </div>
      
      <!-- Empty State -->
      <div v-if="!streamersLoading && sortedStreamers.length === 0" class="empty-state">
        <i class="fas fa-tv"></i>
        <p>Aucun streamer disponible pour le moment.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.streamers-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-4);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-icon {
  font-size: 3rem;
  color: var(--twitch);
  margin-bottom: var(--space-4);
  display: block;
  text-align: center;
  width: 100%;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-4);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.streamers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.streamer-item {
  animation: fadeInUp 0.5s ease backwards;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  gap: var(--space-4);
}

.loading-spinner {
  font-size: 3rem;
  color: var(--twitch);
}

.loading-container p {
  font-size: 1.125rem;
  color: var(--gray-500);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  gap: var(--space-4);
  color: var(--gray-400);
}

.empty-state i {
  font-size: 4rem;
}

.empty-state p {
  font-size: 1.125rem;
}

@media screen and (max-width: 1200px) {
  .streamers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 900px) {
  .streamers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
}

@media screen and (max-width: 600px) {
  .streamers-grid {
    grid-template-columns: 1fr;
  }
  
  .streamers-section {
    padding: var(--space-8) var(--space-4);
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
}
</style>
