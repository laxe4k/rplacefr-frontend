<script setup lang="ts">
defineProps<{
  id?: string
  variant?: 'default' | 'highlight' | 'dark'
}>()
</script>

<template>
  <section :id="id" class="block-container" :class="variant">
    <div class="block-inner">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.block-container {
  width: 100%;
  padding: var(--space-16) var(--space-4);
  position: relative;
  overflow: hidden;
}

.block-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.block-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.block-container.highlight {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
}

.block-container.dark {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--white);
}

.block-container :deep(h2) {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.block-container.dark :deep(h2) {
  color: var(--white);
}

.block-container :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--gray-600);
}

.block-container.dark :deep(h3) {
  color: var(--gray-300);
}

.block-container :deep(p) {
  font-size: 1.125rem;
  color: var(--gray-600);
  margin-bottom: var(--space-6);
  line-height: 1.7;
}

.block-container.dark :deep(p) {
  color: var(--gray-300);
}

.block-container :deep(.icon-feature) {
  font-size: 3rem;
  color: var(--accent);
  margin-bottom: var(--space-4);
  display: block;
  text-align: center;
  width: 100%;
}

.block-container :deep(a.btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .block-container {
    padding: var(--space-10) var(--space-4);
  }
  
  .block-container :deep(h2) {
    font-size: 1.75rem;
  }
  
  .block-container :deep(p) {
    font-size: 1rem;
  }
}
</style>
