import logger from "./logger";

const PERSIST_CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";

export function clearPersistCache(): void {
  try {
    localStorage.removeItem(PERSIST_CACHE_KEY);
    logger.debug("[QueryPersist] Cleared persist cache from localStorage");
  } catch (err) {
    logger.error("[QueryPersist] Failed to clear persist cache:", err);
  }
}

export function hasPersistCache(): boolean {
  try {
    const cache = localStorage.getItem(PERSIST_CACHE_KEY);
    return !!cache;
  } catch {
    return false;
  }
}
