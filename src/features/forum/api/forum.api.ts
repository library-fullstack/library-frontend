import axiosClient from "../../../shared/api/axiosClient";
import type {
  ForumCategory,
  ForumPost,
  ForumPostDetail,
  ForumComment,
  ForumCommentDetail,
  ForumReport,
  UserNotification,
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  UpdateCommentInput,
  CreateReportInput,
  ApiResponse,
  PaginationMeta,
} from "../types/forum.types";

export const forumCategoryApi = {
  getAll: () =>
    axiosClient.get<ApiResponse<ForumCategory[]>>("/forum/categories"),

  getById: (categoryId: number) =>
    axiosClient.get<ApiResponse<ForumCategory>>(
      `/forum/categories/${categoryId}`
    ),

  create: (data: Partial<ForumCategory>) =>
    axiosClient.post<ApiResponse<ForumCategory>>("/forum/categories", data),

  update: (categoryId: number, data: Partial<ForumCategory>) =>
    axiosClient.put<ApiResponse<void>>(`/forum/categories/${categoryId}`, data),

  delete: (categoryId: number) =>
    axiosClient.delete<ApiResponse<void>>(`/forum/categories/${categoryId}`),
};

export const forumPostApi = {
  getAll: (
    categoryId?: number,
    page: number = 1,
    limit: number = 10,
    sortBy: "newest" | "trending" | "most-comments" = "newest",
    search: string = ""
  ) => {
    const params: Record<string, number | string> = {
      page,
      limit,
      sort: sortBy,
    };
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;
    return axiosClient.get<
      ApiResponse<ForumPostDetail[]> & { pagination: PaginationMeta }
    >("/forum/posts", { params });
  },

  getById: (postId: number) =>
    axiosClient.get<ApiResponse<ForumPostDetail>>(`/forum/posts/${postId}`),

  create: (data: CreatePostInput) =>
    axiosClient.post<ApiResponse<ForumPost>>("/forum/posts", data),

  update: (postId: number, data: UpdatePostInput) =>
    axiosClient.put<ApiResponse<void>>(`/forum/posts/${postId}`, data),

  delete: (postId: number) =>
    axiosClient.delete<ApiResponse<void>>(`/forum/posts/${postId}`),

  toggleLike: (postId: number) =>
    axiosClient.post<ApiResponse<{ likes_count: number; is_liked: boolean }>>(
      `/forum/posts/${postId}/like`
    ),

  approve: (postId: number) =>
    axiosClient.post<ApiResponse<void>>(`/forum/posts/${postId}/approve`),

  reject: (postId: number) =>
    axiosClient.post<ApiResponse<void>>(`/forum/posts/${postId}/reject`),

  togglePin: (postId: number) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/moderation/posts/${postId}/pin`
    ),

  toggleLock: (postId: number) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/moderation/posts/${postId}/lock`
    ),

  getPending: (page: number = 1, limit: number = 10) =>
    axiosClient.get<
      ApiResponse<ForumPostDetail[]> & { pagination: PaginationMeta }
    >("/forum/posts/admin/pending", { params: { page, limit } }),

  search: (
    query: string,
    categoryId?: number,
    page: number = 1,
    limit: number = 20
  ) => {
    const params: Record<string, number | string> = { q: query, page, limit };
    if (categoryId) params.categoryId = categoryId;
    return axiosClient.get<
      ApiResponse<ForumPostDetail[]> & { pagination: PaginationMeta }
    >("/forum/search", { params });
  },

  getTrending: (limit: number = 10) =>
    axiosClient.get<ApiResponse<ForumPostDetail[]>>("/forum/search/trending", {
      params: { limit },
    }),

  getByCategory: (
    categoryId: number,
    page: number = 1,
    limit: number = 20,
    sortBy: "newest" | "trending" | "most-comments" = "newest"
  ) =>
    axiosClient.get<
      ApiResponse<ForumPostDetail[]> & { pagination: PaginationMeta }
    >(`/forum/search/category/${categoryId}`, {
      params: { page, limit, sort: sortBy },
    }),
};

export const forumCommentApi = {
  getByPostId: (postId: number, page: number = 1, limit: number = 20) =>
    axiosClient.get<
      ApiResponse<ForumCommentDetail[]> & { pagination: PaginationMeta }
    >(`/forum/comments/post/${postId}`, { params: { page, limit } }),

  getReplies: (commentId: number) =>
    axiosClient.get<ApiResponse<ForumCommentDetail[]>>(
      `/forum/comments/${commentId}/replies`
    ),

  getById: (commentId: number) =>
    axiosClient.get<ApiResponse<ForumCommentDetail>>(
      `/forum/comments/${commentId}`
    ),

  create: (postId: number, data: CreateCommentInput) =>
    axiosClient.post<ApiResponse<ForumComment>>(`/forum/comments`, {
      ...data,
      postId,
    }),

  update: (commentId: number, data: UpdateCommentInput) =>
    axiosClient.patch<ApiResponse<void>>(`/forum/comments/${commentId}`, data),

  delete: (commentId: number) =>
    axiosClient.delete<ApiResponse<void>>(`/forum/comments/${commentId}`),

  toggleLike: (commentId: number) =>
    axiosClient.post<ApiResponse<{ likes_count: number; is_liked: boolean }>>(
      `/forum/comments/${commentId}/like`
    ),

  hide: (commentId: number) =>
    axiosClient.post<ApiResponse<void>>(`/forum/comments/${commentId}/hide`),

  show: (commentId: number) =>
    axiosClient.post<ApiResponse<void>>(`/forum/comments/${commentId}/show`),

  report: (commentId: number, reason: string) =>
    axiosClient.post<ApiResponse<void>>(`/forum/comments/${commentId}/report`, {
      reason,
    }),
};

export const forumReportApi = {
  create: (data: CreateReportInput) =>
    axiosClient.post<ApiResponse<ForumReport>>("/forum/reports", data),

  getAll: (status?: string, page: number = 1, limit: number = 10) => {
    const params: Record<string, number | string | undefined> = { page, limit };
    if (status) params.status = status;
    return axiosClient.get<
      ApiResponse<ForumReport[]> & { pagination: PaginationMeta }
    >("/forum/reports", { params });
  },

  update: (reportId: number, data: Partial<ForumReport>) =>
    axiosClient.put<ApiResponse<void>>(`/forum/reports/${reportId}`, data),
};

export const forumNotificationApi = {
  getAll: (page: number = 1, limit: number = 20) =>
    axiosClient.get<
      ApiResponse<UserNotification[]> & { pagination: PaginationMeta }
    >("/forum/notifications", { params: { page, limit } }),

  getUnread: (limit: number = 20) =>
    axiosClient.get<ApiResponse<UserNotification[]> & { unread_count: number }>(
      "/forum/notifications/unread",
      { params: { limit } }
    ),

  getUnreadCount: () =>
    axiosClient.get<ApiResponse<{ unread_count: number }>>(
      "/forum/notifications/unread/count"
    ),

  markAsRead: (notificationId: number) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/notifications/${notificationId}/read`
    ),

  markAllAsRead: () =>
    axiosClient.post<ApiResponse<void>>("/forum/notifications/read-all"),

  delete: (notificationId: number) =>
    axiosClient.delete<ApiResponse<void>>(
      `/forum/notifications/${notificationId}`
    ),
};
export const forumModerationApi = {
  getPendingPosts: (page: number = 1, limit: number = 20) =>
    axiosClient.get<ApiResponse<ForumPost[]> & { pagination: PaginationMeta }>(
      "/forum/moderation/dashboard/pending-posts",
      { params: { page, limit } }
    ),

  getReports: (status: string = "OPEN", page: number = 1, limit: number = 20) =>
    axiosClient.get<
      ApiResponse<ForumReport[]> & { pagination: PaginationMeta }
    >("/forum/moderation/dashboard/reports", {
      params: { status, page, limit },
    }),

  getActivityLogs: (
    type: string = "FORUM",
    page: number = 1,
    limit: number = 50
  ) =>
    axiosClient.get<ApiResponse<any[]> & { pagination: PaginationMeta }>(
      "/forum/moderation/dashboard/activity-logs",
      { params: { type, page, limit } }
    ),

  getNotifications: (page: number = 1, limit: number = 20) =>
    axiosClient.get<
      ApiResponse<UserNotification[]> & { pagination: PaginationMeta }
    >("/forum/moderation/dashboard/notifications", { params: { page, limit } }),

  approvePost: (postId: number) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/moderation/dashboard/approve-post/${postId}`
    ),

  rejectPost: (postId: number, reason: string) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/moderation/dashboard/reject-post/${postId}`,
      { reason }
    ),

  resolveReport: (
    reportId: number,
    action: "approve" | "dismiss",
    note?: string
  ) =>
    axiosClient.post<ApiResponse<void>>(
      `/forum/moderation/dashboard/resolve-report/${reportId}`,
      { action, note }
    ),
};

export const forumAdminApi = {
  getCategories: () =>
    axiosClient.get<ApiResponse<ForumCategory[]>>("/forum/categories"),

  createCategory: (data: any) =>
    axiosClient.post<ApiResponse<ForumCategory>>(
      "/forum/categories/admin/create",
      data
    ),

  updateCategory: (categoryId: number, data: any) =>
    axiosClient.put<ApiResponse<void>>(
      `/forum/categories/admin/${categoryId}`,
      data
    ),

  deleteCategory: (categoryId: number) =>
    axiosClient.delete<ApiResponse<void>>(
      `/forum/categories/admin/${categoryId}`
    ),

  getForumSettings: () =>
    axiosClient.get<ApiResponse<any>>("/forum/moderation/settings"),

  updateForumSettings: (data: any) =>
    axiosClient.put<ApiResponse<void>>("/forum/moderation/settings", data),
};

export const forumApi = {
  ...forumCategoryApi,
  ...forumPostApi,
  ...forumCommentApi,
  ...forumReportApi,
  ...forumNotificationApi,
  ...forumModerationApi,
  ...forumAdminApi,
};
