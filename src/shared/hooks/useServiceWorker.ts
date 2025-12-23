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
          return;
        }

        const registration = (await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })) as SyncRegistration;

        registrationRef.current = registration;
        setIsRegistered(true);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {});
          }
        });

        navigator.serviceWorker.addEventListener("message", (event: Event) => {
          const messageEvent = event as MessageEvent;
          if (messageEvent.data.type === "SYNC_COMPLETE") {
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
      setIsOnline(true);

      if (registrationRef.current && registrationRef.current.sync) {
        registrationRef.current.sync
          .register("sync-mutations")
          .then(() => {})
          .catch((err: unknown) => {
            logger.error("[SW] Failed to request sync:", err);
          });
      }
    };

    const handleOffline = () => {
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
      return;
    }

    try {
      await registrationRef.current.sync.register("sync-mutations");
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
