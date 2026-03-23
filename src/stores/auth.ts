import { ref, computed } from "vue";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// État de l'authentification
export const user = ref<{
  id: number;
  username: string;
  is_admin: boolean;
} | null>(null);
export const authLoading = ref(false);
export const authError = ref<string | null>(null);

// Computed
export const isAuthenticated = computed(() => !!user.value);
export const isAdmin = computed(() => user.value?.is_admin ?? false);

// Actions
export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  authLoading.value = true;
  authError.value = null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important pour les cookies
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      authError.value = data.detail || "Erreur de connexion";
      return false;
    }

    // Récupérer les infos utilisateur
    await fetchCurrentUser();
    return true;
  } catch (error) {
    authError.value = "Erreur de connexion au serveur";
    return false;
  } finally {
    authLoading.value = false;
  }
}

export async function fetchCurrentUser(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include", // Important pour les cookies
    });

    if (!response.ok) {
      user.value = null;
      return false;
    }

    user.value = await response.json();
    return true;
  } catch {
    user.value = null;
    return false;
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignorer les erreurs
  }
  user.value = null;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  if (!user.value) return { success: false, error: "Non connecté" };

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.detail || "Erreur" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erreur de connexion" };
  }
}

export async function deleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.detail || "Erreur" };
    }
    user.value = null;
    return { success: true };
  } catch {
    return { success: false, error: "Erreur de connexion" };
  }
}

// Initialiser l'utilisateur au chargement
export async function initAuth() {
  await fetchCurrentUser();
}
