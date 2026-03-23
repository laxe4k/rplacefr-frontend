import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import OrganisationView from "../views/OrganisationView.vue";
import StreamersView from "../views/StreamersView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import { isAuthenticated, isAdmin, initAuth } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "La communauté française de r/place sur Reddit" },
    },
    {
      path: "/organisation",
      name: "organisation",
      component: OrganisationView,
      meta: { title: "Organisation et timers de coordination" },
    },
    {
      path: "/streamers",
      name: "streamers",
      component: StreamersView,
      meta: { title: "Streamers de l'événement r/place" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "Page de connexion" },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { title: "Inscription" },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        title: "Panneau d'administration",
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
});

// Guard d'authentification
router.beforeEach(async (to, _from, next) => {
  // Initialiser l'auth si nécessaire
  if (!isAuthenticated.value) {
    await initAuth();
  }

  // Vérifier l'authentification
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next("/login");
  }

  // Vérifier les droits admin
  if (to.meta.requiresAdmin && !isAdmin.value) {
    return next("/login");
  }

  // Mettre à jour le titre
  const title = to.meta.title as string;
  document.title = title ? `r/placeFR - ${title}` : "r/placeFR";
  next();
});

export default router;
