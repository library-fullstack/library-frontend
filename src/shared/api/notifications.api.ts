import axiosClient from "../../shared/api/axiosClient";

export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  link?: string;
  borrow_id?: number;
  post_id?: number;
  rejection_reason?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  user_id: string;
  ntype: "REPLY" | "MENTION" | "MODERATION" | "SYSTEM" | "FAVOURITE" | "BORROW";
  payload: NotificationPayload;
  read_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  async getNotifications(limit: number = 50, offset: number = 0) {
    const res = await axiosClient.get<{
      success: boolean;
      data: Notification[];
      pagination: { limit: number; offset: number; total: number };
    }>("/notifications", {
      params: { limit, offset },
    });
    return res.data;
  },

  async getUnreadCount() {
    const res = await axiosClient.get<{
      success: boolean;
      data: { count: number };
    }>("/notifications/unread-count");
    return res.data;
  },

  async markAsRead(id: number) {
    const res = await axiosClient.patch<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res = await axiosClient.patch<{
      success: boolean;
      message: string;
    }>("/notifications/mark-all-read");
    return res.data;
  },

  async deleteNotification(id: number) {
    const res = await axiosClient.delete<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}`);
    return res.data;
  },
};
