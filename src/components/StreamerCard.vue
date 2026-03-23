<script setup lang="ts">
import type { Streamer } from '../stores/app'

defineProps<{
  streamer: Streamer
}>()
</script>

<template>
  <article class="streamer-card" :class="{ live: streamer.isLive }">
    <a :href="`https://twitch.tv/${streamer.name}`" target="_blank" rel="noopener noreferrer">
      <div class="card-image">
        <img :src="streamer.profileImage" :alt="streamer.name" loading="lazy" />
        <div class="card-overlay"></div>
        <span v-if="streamer.isLive" class="live-badge">
          <i class="fas fa-circle pulse"></i>
          LIVE
        </span>
      </div>
      <div class="card-content">
        <span class="streamer-name">{{ streamer.name }}</span>
        <span class="watch-btn">
          <i class="fab fa-twitch"></i>
          Regarder
        </span>
      </div>
    </a>
  </article>
</template>

<style scoped>
.streamer-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all var(--transition-base);
  position: relative;
}

.streamer-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.streamer-card.live {
  box-shadow: 0 4px 20px rgba(145, 70, 255, 0.3);
}

.streamer-card.live:hover {
  box-shadow: 0 12px 40px rgba(145, 70, 255, 0.4);
}

.streamer-card a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.streamer-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.streamer-card:hover .card-overlay {
  opacity: 1;
}

.live-badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--danger);
  color: var(--white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
}

.live-badge .pulse {
  font-size: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.card-content {
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
}

.streamer-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--gray-900);
}

.watch-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--twitch);
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(10px);
  transition: all var(--transition-base);
}

.streamer-card:hover .watch-btn {
  opacity: 1;
  transform: translateX(0);
}

@media screen and (max-width: 600px) {
  .watch-btn {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
