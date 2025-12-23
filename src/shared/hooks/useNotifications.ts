import { useState, useEffect, useCallback } from "react";
import { notificationsApi, type Notification } from "../api/notifications.api";
import { useAuthContext } from "../../context/useAuthContext";

export function useNotifications() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await notificationsApi.getNotifications();
      console.log("[useNotifications] Fetched notifications:", response);
      setNotifications(response.data);
    } catch (err) {
      setError("Không thể tải thông báo");
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await notificationsApi.getUnreadCount();
      console.log("[useNotifications] Unread count:", response.data.count);
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  const deleteNotification = useCallback(
    async (id: number) => {
      try {
        await notificationsApi.deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        const wasUnread = notifications.find((n) => n.id === id && !n.read_at);
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    },
    [notifications]
  );

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();

      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
