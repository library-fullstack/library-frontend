const SERVER_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY || "";

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: Record<string, unknown>;
}

export class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return (
      "serviceWorker" in navigator &&
      "Notification" in window &&
      "PushManager" in window
    );
  }

  async init(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
    } catch (err) {
      console.error("[Push] Failed to initialize:", err);
    }
  }

  async requestPermission(): Promise<NotificationPermission | null> {
    if (!this.isSupported) return null;

    try {
      const permission = await Notification.requestPermission();
      console.log("[Push] Permission granted:", permission);
      return permission;
    } catch (err) {
      console.error("[Push] Failed to request permission:", err);
      return null;
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.registration) {
      return null;
    }

    try {
      let subscription = await this.registration.pushManager.getSubscription();

      if (!subscription) {
        if (Notification.permission !== "granted") {
          const permission = await this.requestPermission();
          if (permission !== "granted") {
            console.warn("[Push] Permission denied");
            return null;
          }
        }

        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            SERVER_PUBLIC_KEY
          ) as BufferSource,
        });
      }

      return subscription;
    } catch (err) {
      console.error("[Push] Failed to subscribe:", err);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const subscription =
        await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      return false;
    } catch (err) {
      console.error("[Push] Failed to unsubscribe:", err);
      return false;
    }
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported || !this.registration) {
      return;
    }

    try {
      const notifyOpts: NotificationOptions = {
        title: options.title,
        body: options.body,
        icon: options.icon || "/assets/icon-192x192.png",
        badge: options.badge || "/assets/badge-72x72.png",
        tag: options.tag || "default",
        requireInteraction: options.requireInteraction || false,
        data: options.data,
      };

      await this.registration.showNotification(options.title, notifyOpts);
    } catch (err) {
      console.error("[Push] Failed to show notification:", err);
    }
  }

  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported || !this.registration) return false;

    try {
      const subscription =
        await this.registration.pushManager.getSubscription();
      return !!subscription;
    } catch (err) {
      console.error("[Push] Failed to check subscription:", err);
      return false;
    }
  }

  async getSubscriptionEndpoint(): Promise<string | null> {
    if (!this.registration) return null;

    try {
      const subscription =
        await this.registration.pushManager.getSubscription();
      if (subscription) {
        return subscription.endpoint;
      }
    } catch (err) {
      console.error("[Push] Failed to get subscription endpoint:", err);
    }
    return null;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();
