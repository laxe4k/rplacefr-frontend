<script setup lang="ts">
import { onMounted } from 'vue'
import BannerSection from '../components/BannerSection.vue'
import BlockContainer from '../components/BlockContainer.vue'
import { eventActive, links, fetchConfig } from '../stores/app'

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <main>
    <BannerSection />
    
    <!-- Mode actif: r/place en cours -->
    <template v-if="eventActive">
      <BlockContainer id="bots">
        <i class="fas fa-download icon-feature"></i>
        <h2>Toi aussi aide nous à défendre la France !</h2>
        <p>Suis le tuto pour installer le script et aide nous à défendre la France sur r/place !</p>
        <a :href="links.tuto" target="_blank" class="btn btn-primary">
          <i class="fas fa-play-circle"></i>
          Télécharge le script
        </a>
      </BlockContainer>
      
      <div class="divider"></div>
      
      <BlockContainer id="discord" variant="highlight">
        <i class="fab fa-discord icon-feature" style="color: var(--discord);"></i>
        <h2>Rejoins nous sur Discord !</h2>
        <p>Rejoins la communauté sur Discord pour discuter, s'organiser et participer aux événements !</p>
        <a :href="links.discord" target="_blank" class="btn btn-discord">
          <i class="fab fa-discord"></i>
          Discord de r/placeFR
        </a>
      </BlockContainer>
      
      <div class="divider"></div>
      
      <BlockContainer id="subreddit">
        <i class="fab fa-reddit-alien icon-feature" style="color: var(--reddit);"></i>
        <h2>Rejoins nous sur Reddit !</h2>
        <p>Retrouve les actualités, les memes et les discussions sur notre subreddit !</p>
        <a :href="links.reddit" target="_blank" class="btn btn-reddit">
          <i class="fab fa-reddit-alien"></i>
          Subreddit r/placeFR
        </a>
      </BlockContainer>
      
      <div class="divider"></div>
      
      <BlockContainer id="relations" variant="highlight">
        <i class="fas fa-handshake icon-feature" style="color: var(--success);"></i>
        <h2>Nos relations internationales</h2>
        <p>Découvre le tableau des alliances et relations entre les différentes communautés de r/place.</p>
        <a :href="links.relations" target="_blank" class="btn btn-secondary">
          <i class="fas fa-globe"></i>
          Tableau des relations
        </a>
      </BlockContainer>
    </template>
    
    <!-- Mode inactif: r/place terminé -->
    <template v-else>
      <BlockContainer id="end">
        <i class="fas fa-flag-checkered icon-feature"></i>
        <h2>Le r/place est terminé !</h2>
        <h3>Rendez-vous au prochain r/place !</h3>
        <p>L'événement est terminé mais tu peux toujours explorer notre œuvre collective sur l'Atlas !</p>
        <a :href="links.atlas" target="_blank" class="btn btn-primary">
          <i class="fas fa-map-marked-alt"></i>
          Explorer l'Atlas
        </a>
      </BlockContainer>
      
      <div class="divider"></div>
      
      <BlockContainer id="discord" variant="highlight">
        <i class="fab fa-discord icon-feature" style="color: var(--discord);"></i>
        <h2>Reste connecté sur Discord !</h2>
        <p>Même hors événement, la communauté reste active. Rejoins-nous pour ne rien manquer !</p>
        <a :href="links.discord" target="_blank" class="btn btn-discord">
          <i class="fab fa-discord"></i>
          Discord de r/placeFR
        </a>
      </BlockContainer>
      
      <div class="divider"></div>
      
      <BlockContainer id="subreddit">
        <i class="fab fa-reddit-alien icon-feature" style="color: var(--reddit);"></i>
        <h2>Rejoins le Subreddit !</h2>
        <p>Les meilleurs moments, les souvenirs et les prochaines annonces sur Reddit !</p>
        <a :href="links.reddit" target="_blank" class="btn btn-reddit">
          <i class="fab fa-reddit-alien"></i>
          Subreddit r/placeFR
        </a>
      </BlockContainer>
    </template>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.divider {
  width: 100%;
  max-width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
  margin: 0;
}
</style>
