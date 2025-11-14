const CACHE_NAME = "library-ui-v1";
const API_BASE_URL = self.location.origin;

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");
  event.waitUntil(clients.claim());
});

self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "sync-mutations") {
    event.waitUntil(syncPendingMutations());
  }
});

async function syncPendingMutations() {
  try {
    const dbRequest = indexedDB.open("keyval-store");

    return new Promise((resolve, reject) => {
      dbRequest.onsuccess = async () => {
        try {
          const db = dbRequest.result;
          const tx = db.transaction("keyval");
          const store = tx.objectStore("keyval");

          const allRequest = store.getAll();
          allRequest.onsuccess = async () => {
            const allData = allRequest.result;
            const mutations = [];

            for (let i = 0; i < allData.length; i++) {
              const key = (await store.getAllKeys())[i];
              if (
                typeof key === "string" &&
                key.startsWith("lib-pending-mutations")
              ) {
                const mutationList = allData[i];
                if (Array.isArray(mutationList)) {
                  mutations.push(...mutationList);
                }
              }
            }

            console.log("[SW] Found pending mutations:", mutations.length);

            const results = await Promise.allSettled(
              mutations.map((mut) => syncMutation(mut))
            );

            const succeeded = results.filter(
              (r) => r.status === "fulfilled"
            ).length;
            const failed = results.filter(
              (r) => r.status === "rejected"
            ).length;

            console.log(
              `[SW] Sync results - Succeeded: ${succeeded}, Failed: ${failed}`
            );

            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({
                type: "SYNC_COMPLETE",
                succeeded,
                failed,
              });
            });

            resolve({ succeeded, failed });
          };

          allRequest.onerror = reject;
        } catch (err) {
          console.error("[SW] Sync error:", err);
          reject(err);
        }
      };

      dbRequest.onerror = reject;
    });
  } catch (err) {
    console.error("[SW] Failed to sync mutations:", err);
    throw err;
  }
}

async function syncMutation(mutation) {
  const { action, data, id } = mutation;

  const endpoints = {
    ADD_TO_CART: { method: "POST", path: "/api/borrow-carts/items" },
    REMOVE_FROM_CART: { method: "DELETE", path: "/api/borrow-carts/items" },
    BORROW: { method: "POST", path: "/api/borrows" },
    FAVORITE: { method: "POST", path: "/api/favourites" },
    UNFAVORITE: { method: "DELETE", path: "/api/favourites" },
  };

  const endpoint = endpoints[action];
  if (!endpoint) {
    throw new Error(`Unknown action: ${action}`);
  }

  const url = API_BASE_URL + endpoint.path;

  console.log(`[SW] Syncing mutation ${id}: ${action} to ${url}`);

  const response = await fetch(url, {
    method: endpoint.method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  console.log(`[SW] Successfully synced mutation ${id}`);
  return { id, success: true };
}

self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
