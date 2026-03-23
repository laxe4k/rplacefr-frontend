<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { links } from '../stores/app'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer-content">
      <div class="footer-brand">
        <img src="/img/rplaceFR-Logo.webp" alt="r/placeFR" title="r/placeFR" class="footer-logo" />
        <span class="footer-title">r/placeFR</span>
      </div>
      
      <div class="footer-links">
        <a :href="links.discord" target="_blank" class="social-link discord" aria-label="Discord" title="Discord r/placeFR">
          <i class="fab fa-discord"></i>
        </a>
        <a :href="links.reddit" target="_blank" class="social-link reddit" aria-label="Reddit" title="Subreddit r/placeFR">
          <i class="fab fa-reddit-alien"></i>
        </a>
        <a href="https://github.com/laxe4k" target="_blank" class="social-link github" aria-label="GitHub" title="GitHub Laxe4k">
          <i class="fab fa-github"></i>
        </a>
      </div>
      
      <div class="footer-copyright">
        <p>
          &copy; 2023 - {{ currentYear }} 
          <a href="https://laxe4k.com" target="_blank" class="author-link" title="Site de Laxe4k">Laxe4k</a>
          <span class="separator">|</span>
          Tous droits réservés
        </p>
        <p class="made-with">
          Fait avec <i class="fas fa-heart heart-icon"></i> pour la communauté
        </p>
        <RouterLink to="/admin" class="admin-link" title="Administration">
          <i class="fas fa-lock"></i>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  padding: var(--space-8) var(--space-4);
  margin-top: auto;
  position: relative;
}

footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.footer-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--white) 0%, var(--accent-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-links {
  display: flex;
  gap: var(--space-4);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 1.25rem;
  transition: all var(--transition-base);
}

.social-link:hover {
  transform: translateY(-4px) scale(1.1);
}

.social-link.discord:hover {
  background: var(--discord);
  box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
}

.social-link.reddit:hover {
  background: var(--reddit);
  box-shadow: 0 8px 20px rgba(255, 69, 0, 0.4);
}

.social-link.github:hover {
  background: var(--gray-700);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.footer-copyright {
  text-align: center;
}

.footer-copyright p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.author-link {
  color: var(--accent-light);
  font-weight: 600;
  transition: color var(--transition-fast);
}

.author-link:hover {
  color: var(--white);
}

.separator {
  margin: 0 var(--space-2);
  opacity: 0.5;
}

.made-with {
  margin-top: var(--space-2);
  font-size: 0.8rem;
}

.heart-icon {
  color: var(--danger);
  animation: pulse 1.5s ease-in-out infinite;
}

.code-icon {
  color: var(--accent-light);
}

.admin-link {
  display: inline-flex;
  margin-top: var(--space-3);
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
  transition: color var(--transition-fast);
}

.admin-link:hover {
  color: var(--accent-light);
}

@media screen and (max-width: 768px) {
  .footer-content {
    gap: var(--space-4);
  }
  
  .footer-copyright p {
    font-size: 0.75rem;
  }
}
</style>
