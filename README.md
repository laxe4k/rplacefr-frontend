# r/placeFR Frontend

![GitHub Release](https://img.shields.io/github/v/release/laxe4k/rplacefr-frontend)
![GitHub License](https://img.shields.io/github/license/laxe4k/rplacefr-frontend)

Frontend pour le site r/placeFR, construit avec Vue 3 + TypeScript + Vite.

## Installation

```bash
# Installer les dépendances
npm install
```

## Configuration

Le frontend communique avec le backend FastAPI. Par défaut, il utilise `http://localhost:8000` en développement.

## Lancement

```bash
# Mode développement avec hot-reload
npm run dev

# Vérification des types et compilation pour la production
npm run build
```

## Structure du projet

- `src/views/` - Pages de l'application (Home, Organisation, Streamers, Admin)
- `src/components/` - Composants réutilisables (Header, Footer, Banner)
- `src/stores/` - Stores Pinia (auth, config)
- `src/router/` - Configuration des routes Vue Router

## Docker

```bash
# Avec docker-compose
docker compose up -d

# Ou manuellement
docker build -t rplacefr-frontend .
docker run -p 80:80 rplacefr-frontend
```

## IDE recommandé

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
