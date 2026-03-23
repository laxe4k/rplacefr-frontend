<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { eventActive, links } from '../stores/app'

const menuOpen = ref(false)
const route = useRoute()
const scrolled = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = (e: MouseEvent) => {
  const menu = document.getElementById('menu')
  const burger = document.getElementById('burger')
  if (menu && burger && !menu.contains(e.target as Node) && !burger.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('click', closeMenu)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header>
    <div class="header-content">
      <img src="/img/rplaceFR-Logo.webp" alt="logo r/placeFR" title="r/placeFR" class="logo animate-float" />
      <div class="header-title">
        <h1 class="gradient-text">r/placeFR</h1>
        <p class="tagline">La communauté française de r/place</p>
      </div>
    </div>
  </header>
  <nav :class="{ scrolled }">
    <div class="nav-container">
      <button id="burger" @click="toggleMenu" :class="{ open: menuOpen }" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul id="menu" :class="{ active: menuOpen }">
        <template v-if="eventActive">
          <li>
            <RouterLink to="/" title="Accueil r/placeFR" :class="{ active: route.path === '/' }">
              <i class="fas fa-home"></i>
              <span>Accueil</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/organisation" title="Organisation des événements" :class="{ active: route.path === '/organisation' }">
              <i class="fas fa-calendar-alt"></i>
              <span>Organisation</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/streamers" title="Streamers partenaires" :class="{ active: route.path === '/streamers' }">
              <i class="fab fa-twitch"></i>
              <span>Streamers</span>
            </RouterLink>
          </li>
          <li>
            <a :href="links.tuto" target="_blank" title="Tutoriel r/place" class="external">
              <i class="fas fa-book"></i>
              <span>Tuto</span>
            </a>
          </li>
          <li class="social discord">
            <a :href="links.discord" target="_blank" title="Rejoindre le Discord r/placeFR">
              <i class="fab fa-discord"></i>
              <span>Discord</span>
            </a>
          </li>
          <li class="social reddit">
            <a :href="links.reddit" target="_blank" title="Subreddit r/placeFR">
              <i class="fab fa-reddit-alien"></i>
              <span>Reddit</span>
            </a>
          </li>
          <li>
            <a :href="links.relations" target="_blank" title="Relations diplomatiques" class="external">
              <i class="fas fa-handshake"></i>
              <span>Relations</span>
            </a>
          </li>
        </template>
        <template v-else>
          <li>
            <RouterLink to="/" title="Accueil r/placeFR" :class="{ active: route.path === '/' }">
              <i class="fas fa-home"></i>
              <span>Accueil</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/streamers" title="Streamers partenaires" :class="{ active: route.path === '/streamers' }">
              <i class="fab fa-twitch"></i>
              <span>Streamers</span>
            </RouterLink>
          </li>
          <li>
            <a :href="links.atlas" target="_blank" title="Atlas r/place 2023" class="external">
              <i class="fas fa-map"></i>
              <span>Atlas</span>
            </a>
          </li>
          <li class="social discord">
            <a :href="links.discord" target="_blank" title="Rejoindre le Discord r/placeFR">
              <i class="fab fa-discord"></i>
              <span>Discord</span>
            </a>
          </li>
          <li class="social reddit">
            <a :href="links.reddit" target="_blank" title="Subreddit r/placeFR">
              <i class="fab fa-reddit-alien"></i>
              <span>Reddit</span>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--white);
  padding: var(--space-8) var(--space-4);
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
}

.logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.logo:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
}

.header-title {
  text-align: center;
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Navigation */
nav {
  position: sticky;
  top: 0;
  background: var(--primary);
  padding: var(--space-3) var(--space-4);
  z-index: 1000;
  transition: all var(--transition-base);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

nav.scrolled {
  background: rgba(10, 10, 46, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lg);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

nav ul {
  display: flex;
  list-style: none;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
}

nav ul li a {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--white);
  font-weight: 600;
  font-size: 0.95rem;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  position: relative;
}

nav ul li a i {
  font-size: 1.1rem;
  transition: transform var(--transition-fast);
}

nav ul li a:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

nav ul li a:hover i {
  transform: scale(1.2);
}

nav ul li a.active {
  background: var(--accent);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* Social Links */
nav ul li.social.discord a:hover {
  background: var(--discord);
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4);
}

nav ul li.social.reddit a:hover {
  background: var(--reddit);
  box-shadow: 0 4px 15px rgba(255, 69, 0, 0.4);
}

/* Burger Menu */
#burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-2);
  cursor: pointer;
  z-index: 1001;
}

#burger span {
  width: 28px;
  height: 3px;
  background: var(--white);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  transform-origin: center;
}

#burger.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

#burger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

#burger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Styles */
@media screen and (max-width: 768px) {
  .header-title h1 {
    font-size: 1.8rem;
  }
  
  .logo {
    width: 90px;
    height: 90px;
  }

  #burger {
    display: flex;
  }

  .nav-container {
    justify-content: flex-start;
  }

  #menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--primary-dark);
    padding: var(--space-4);
    gap: var(--space-2);
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: all var(--transition-base);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    box-shadow: var(--shadow-xl);
  }

  #menu.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  nav ul li a {
    width: 100%;
    justify-content: flex-start;
    padding: var(--space-3) var(--space-4);
  }
}
</style>
