<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import HeaderNav from './components/HeaderNav.vue'
import FooterBar from './components/FooterBar.vue'
import { fetchConfig } from './stores/app'

const route = useRoute()
const showNav = computed(() => !route.path.startsWith('/login') && !route.path.startsWith('/admin'))

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <div class="app-wrapper">
    <HeaderNav v-if="showNav" />
    <RouterView />
    <FooterBar v-if="showNav" />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-wrapper > :deep(main) {
  flex: 1;
}
</style>
