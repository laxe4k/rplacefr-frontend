<script setup lang="ts">
</script>

<template>
  <section id="presentation">
    <h1 class="sr-only">r/placeFR</h1>
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <picture>
        <source type="image/webp" media="(max-width: 480px)" srcset="/img/rplaceFR-Banner400x225.webp">
        <source type="image/jpg" media="(max-width: 480px)" srcset="/img/rplaceFR-Banner400x225.jpg">
        <source type="image/webp" media="(max-width: 640px)" srcset="/img/rplaceFR-Banner640x360.webp">
        <source type="image/jpg" media="(max-width: 640px)" srcset="/img/rplaceFR-Banner640x360.jpg">
        <source type="image/webp" media="(max-width: 960px)" srcset="/img/rplaceFR-Banner960x540.webp">
        <source type="image/jpg" media="(max-width: 960px)" srcset="/img/rplaceFR-Banner960x540.jpg">
        <source type="image/webp" media="(max-width: 1440px)" srcset="/img/rplaceFR-Banner1440x810.webp">
        <source type="image/jpg" media="(max-width: 1440px)" srcset="/img/rplaceFR-Banner1440x810.jpg">
        <img src="/img/rplaceFR-Banner.webp" alt="r/placeFR Banner" title="Bannière r/placeFR">
      </picture>
    </div>
    <div class="scroll-indicator">
      <i class="fas fa-chevron-down"></i>
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

#presentation {
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 300px;
  max-height: 500px;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 46, 0.3) 0%,
    rgba(10, 10, 46, 0) 30%,
    rgba(10, 10, 46, 0) 70%,
    rgba(249, 250, 251, 1) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.banner-content {
  width: 100%;
  height: 100%;
}

.banner-content picture,
.banner-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scroll-indicator {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: var(--gray-600);
  font-size: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

@media screen and (max-width: 768px) {
  #presentation {
    height: 35vh;
    min-height: 200px;
  }
  
  .scroll-indicator {
    bottom: var(--space-4);
    font-size: 1.25rem;
  }
}
</style>
