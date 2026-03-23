import { ref } from "vue";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// État admin
export const adminEvent = ref(false);
export const adminLinks = ref({
  discord: "",
  reddit: "",
  tuto: "",
  atlas: "",
  relations: "",
});
export const adminStreamers = ref<string[]>([]);
export const adminLoading = ref(false);
export const adminError = ref<string | null>(null);

// Helper pour les requêtes authentifiées (utilise cookies httpOnly)
async function authFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Envoie les cookies httpOnly
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Erreur");
  }

  return response.json();
}

// ==================== EVENT ====================

export async function fetchAdminEvent() {
  adminLoading.value = true;
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/event`);
    adminEvent.value = data.event;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
  } finally {
    adminLoading.value = false;
  }
}

export async function updateAdminEvent(event: boolean) {
  adminLoading.value = true;
  try {
    await authFetch(`${API_BASE_URL}/api/admin/event`, {
      method: "PUT",
      body: JSON.stringify({ event }),
    });
    adminEvent.value = event;
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  } finally {
    adminLoading.value = false;
  }
}

// ==================== LINKS ====================

export async function fetchAdminLinks() {
  adminLoading.value = true;
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/links`);
    adminLinks.value = data;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
  } finally {
    adminLoading.value = false;
  }
}

export async function updateAdminLinks(links: typeof adminLinks.value) {
  adminLoading.value = true;
  try {
    await authFetch(`${API_BASE_URL}/api/admin/links`, {
      method: "PUT",
      body: JSON.stringify(links),
    });
    adminLinks.value = { ...links };
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  } finally {
    adminLoading.value = false;
  }
}

// ==================== STREAMERS ====================

export async function fetchAdminStreamers() {
  adminLoading.value = true;
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/streamers`);
    adminStreamers.value = data.streamers.map((s: { name: string }) => s.name);
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
  } finally {
    adminLoading.value = false;
  }
}

export async function addAdminStreamer(name: string) {
  adminLoading.value = true;
  try {
    await authFetch(`${API_BASE_URL}/api/admin/streamers`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    adminStreamers.value.push(name.toLowerCase());
    adminStreamers.value.sort();
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  } finally {
    adminLoading.value = false;
  }
}

export async function deleteAdminStreamer(name: string) {
  adminLoading.value = true;
  try {
    await authFetch(`${API_BASE_URL}/api/admin/streamers/${name}`, {
      method: "DELETE",
    });
    adminStreamers.value = adminStreamers.value.filter((s) => s !== name);
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  } finally {
    adminLoading.value = false;
  }
}

// ==================== USERS ====================

export interface PendingUser {
  id: number;
  username: string;
  created_at: string;
}

export const pendingUsers = ref<PendingUser[]>([]);
export const totalUsers = ref(0);
export const allUsers = ref<{ id: number; username: string; created_at: string }[]>([]);

export async function fetchPendingUsers() {
  adminLoading.value = true;
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/users/pending`);
    pendingUsers.value = data.users;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
  } finally {
    adminLoading.value = false;
  }
}

export async function fetchTotalUsers() {
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/users/count`);
    totalUsers.value = data.count;
  } catch {
    // silencieux
  }
}

export async function fetchAllUsers() {
  try {
    const data = await authFetch(`${API_BASE_URL}/api/admin/users/all`);
    allUsers.value = data.users;
  } catch {
    // silencieux
  }
}

export async function approveUser(userId: number) {
  try {
    await authFetch(`${API_BASE_URL}/api/admin/users/${userId}/approve`, {
      method: "POST",
    });
    pendingUsers.value = pendingUsers.value.filter((u) => u.id !== userId);
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  }
}

export async function rejectUser(userId: number) {
  try {
    await authFetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    pendingUsers.value = pendingUsers.value.filter((u) => u.id !== userId);
    return true;
  } catch (error: unknown) {
    adminError.value = error instanceof Error ? error.message : "Erreur";
    return false;
  }
}
