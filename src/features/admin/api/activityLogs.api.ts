import axiosClient from "../../../shared/api/axiosClient";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  type: "SYSTEM" | "FORUM" | "BOOK" | "BORROW" | "USER" | "ORDER" | "OTHER";
  action: string;
  target_type: string | null;
  target_id: string | null;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
}

export const activityLogsApi = {
  getRecentActivities: (limit: number = 10) => {
    return axiosClient.get<{ success: boolean; data: ActivityLog[] }>(
      `/activity-logs/recent?limit=${limit}`
    );
  },

  getActivitiesByUser: (userId: string, limit: number = 20) => {
    return axiosClient.get<{ success: boolean; data: ActivityLog[] }>(
      `/activity-logs/user/${userId}?limit=${limit}`
    );
  },

  createActivityLog: (data: Partial<ActivityLog>) => {
    return axiosClient.post<{ success: boolean; data: { id: string } }>(
      `/activity-logs`,
      data
    );
  },
};
