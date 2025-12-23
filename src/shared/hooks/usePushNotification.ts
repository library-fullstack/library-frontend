import { useEffect, useState, useCallback } from "react";
import {
  pushNotificationService,
  NotificationOptions,
} from "../lib/pushNotificationService";
import logger from "../lib/logger";

interface UsePushNotificationOptions {
  enabled?: boolean;
  autoSubscribe?: boolean;
}

export function usePushNotification(options: UsePushNotificationOptions = {}) {
  const { enabled = true, autoSubscribe = false } = options;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const sub = await pushNotificationService.subscribe();
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
        return sub;
      } else {
        throw new Error("Failed to subscribe to push notifications");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("[Push Hook] Failed to subscribe:", errMsg);
      setError(errMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const initialize = async () => {
      try {
        await pushNotificationService.init();
        logger.info("[Push Hook] Push notification service initialized");

        const subscribed = await pushNotificationService.isSubscribed();
        setIsSubscribed(subscribed);

        if (autoSubscribe && !subscribed) {
          await subscribe();
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        logger.error("[Push Hook] Failed to initialize:", errMsg);
        setError(errMsg);
      }
    };

    initialize();
  }, [enabled, autoSubscribe, subscribe]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        setSubscription(null);
        setIsSubscribed(false);
        return true;
      }
      return false;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("[Push Hook] Failed to unsubscribe:", errMsg);
      setError(errMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    try {
      await pushNotificationService.showNotification(options);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("[Push Hook] Failed to show notification:", errMsg);
      setError(errMsg);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      return permission;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("[Push Hook] Failed to request permission:", errMsg);
      setError(errMsg);
      return null;
    }
  }, []);

  return {
    isSubscribed,
    subscription,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    showNotification,
    requestPermission,
  };
}
