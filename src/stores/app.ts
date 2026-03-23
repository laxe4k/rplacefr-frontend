import { ref, computed } from "vue";

// État de l'événement r/place (actif ou non)
export const eventActive = ref(false);

// Liens externes
export const links = ref({
  discord: "",
  reddit: "",
  tuto: "",
  atlas: "",
  relations: "",
});

// Streamers data
export interface Streamer {
  name: string;
  profileImage: string;
  isLive: boolean;
}

export const streamers = ref<Streamer[]>([]);
export const streamersLoading = ref(false);

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Fetch configuration depuis l'API
export async function fetchConfig() {
  try {
    console.log("Fetching config from:", `${API_BASE_URL}/api/config`);
    const response = await fetch(`${API_BASE_URL}/api/config`);
    const data = await response.json();
    console.log("Config reçue:", data);
    console.log("Event value:", data.event, "Type:", typeof data.event);
    eventActive.value = data.event;
    links.value = data.links;
  } catch (error) {
    console.error("Erreur lors du chargement de la configuration:", error);
  }
}

// Fetch streamers depuis l'API
export async function fetchStreamers() {
  streamersLoading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/streamers`);
    const data = await response.json();
    streamers.value = data.streamers;
  } catch (error) {
    console.error("Erreur lors du chargement des streamers:", error);
  } finally {
    streamersLoading.value = false;
  }
}

// Computed pour les streamers triés (live en premier)
export const sortedStreamers = computed(() => {
  const live = streamers.value
    .filter((s) => s.isLive)
    .sort((a, b) => a.name.localeCompare(b.name));
  const offline = streamers.value
    .filter((s) => !s.isLive)
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...live, ...offline];
});
