import { useEffect, useState, useRef } from "react";
import logger from "../lib/logger";

interface UseServiceWorkerOptions {
  onSyncComplete?: (result: { succeeded: number; failed: number }) => void;
  enabled?: boolean;
}

interface SyncRegistration extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

export function useServiceWorker({
  onSyncComplete,
  enabled = true,
}: UseServiceWorkerOptions = {}) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const registrationRef = useRef<SyncRegistration | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const registerServiceWorker = async () => {
      try {
        if (!("serviceWorker" in navigator)) {
          logger.warn("[SW] Service Worker not supported");
          return;
        }

        const registration = (await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })) as SyncRegistration;

        registrationRef.current = registration;
        logger.info("[SW] Service Worker registered");
        setIsRegistered(true);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            logger.info("[SW] New version found");
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                logger.info("[SW] Service Worker updated");
              }
            });
          }
        });

        navigator.serviceWorker.addEventListener("message", (event: Event) => {
          const messageEvent = event as MessageEvent;
          if (messageEvent.data.type === "SYNC_COMPLETE") {
            logger.info("[SW] Sync completed", messageEvent.data);
            onSyncComplete?.(messageEvent.data);
          }
        });

        setInterval(() => {
          registration.update();
        }, 60000);
      } catch (err: unknown) {
        logger.error("[SW] Failed to register Service Worker:", err);
      }
    };

    registerServiceWorker();

    const handleOnline = () => {
      logger.info("[SW] App is online");
      setIsOnline(true);

      if (registrationRef.current && registrationRef.current.sync) {
        registrationRef.current.sync
          .register("sync-mutations")
          .then(() => {
            logger.info("[SW] Sync requested");
          })
          .catch((err: unknown) => {
            logger.error("[SW] Failed to request sync:", err);
          });
      }
    };

    const handleOffline = () => {
      logger.warn("[SW] App is offline");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [enabled, onSyncComplete]);

  const triggerSync = async () => {
    if (!registrationRef.current || !registrationRef.current.sync) {
      logger.warn("[SW] Service Worker not registered");
      return;
    }

    try {
      await registrationRef.current.sync.register("sync-mutations");
      logger.info("[SW] Manual sync triggered");
    } catch (err: unknown) {
      logger.error("[SW] Failed to trigger sync:", err);
    }
  };

  const updateApp = () => {
    if (!registrationRef.current) return;

    const newWorker = registrationRef.current.waiting;
    if (newWorker) {
      newWorker.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  return {
    isRegistered,
    isOnline,
    triggerSync,
    updateApp,
  };
}
