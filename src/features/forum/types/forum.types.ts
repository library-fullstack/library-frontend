export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  description?: string | null;
  sort_order: number;
  is_locked: boolean;
  allowed_roles?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ForumAuthor {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface ForumPostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ForumPost {
  id: number;
  user_id?: string | null;
  userId?: string | null;
  category_id?: number;
  categoryId?: number;
  title: string;
  slug: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "LOCKED" | "DELETED";
  pinned?: boolean;
  isPinned?: boolean;
  is_locked?: boolean;
  isLocked?: boolean;
  views_count?: number;
  viewsCount?: number;
  comments_count?: number;
  commentsCount?: number;
  likes_count?: number;
  likesCount?: number;
  is_liked?: boolean;
  isLiked?: boolean;
  approved_by?: string | null;
  approved_at?: string | null;
  locked_by?: string | null;
  locked_at?: string | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  full_name?: string;
  avatar_url?: string;
  category_name?: string;
  category_slug?: string;
  attachments?: Array<{
    id: number;
    file_url: string;
    file_name: string;
    original_name: string;
    file_type: string;
    file_size: number;
  }>;
}

export interface ForumPostDetail extends ForumPost {
  author?: ForumAuthor;
  category?: ForumPostCategory;
}

export interface ForumComment {
  id: number;
  post_id: number;
  user_id?: string | null;
  parent_id?: number | null;
  content: string;
  status: "VISIBLE" | "HIDDEN" | "DELETED";
  created_at?: string;
  updated_at?: string;
}

export interface ForumCommentDetail extends ForumComment {
  author?: ForumAuthor;
  likes_count?: number;
  is_liked?: boolean;
  replies?: ForumCommentDetail[];
}

export interface ForumReport {
  id: number;
  target_type: "POST" | "COMMENT";
  target_post_id?: number | null;
  target_comment_id?: number | null;
  reporter_id: string;
  reason: string;
  status: "OPEN" | "REVIEWING" | "RESOLVED" | "DISMISSED";
  handled_by?: string | null;
  resolution_note?: string | null;
  created_at?: string;
  updated_at?: string;
  reporter_name?: string;
  reporter_avatar?: string;
  handler_name?: string;
  post_title?: string;
  comment_content?: string;
}

export interface UserNotification {
  id: number;
  user_id: string;
  ntype: "REPLY" | "MENTION" | "MODERATION" | "SYSTEM";
  payload: {
    postId?: number;
    commentId?: number;
    excerpt?: string;
    byUserId?: string;
    byUserName?: string;
    action?: string;
    [key: string]: unknown;
  };
  read_at?: string | null;
  created_at?: string;
}

export interface CreatePostInput {
  categoryId: number;
  title: string;
  content: string;
  files?: Array<{
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
  }>;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

export interface CreateCommentInput {
  post_id: number;
  parent_id?: number | null;
  content: string;
}

export interface UpdateCommentInput {
  content?: string;
}

export interface CreateReportInput {
  target_type: "POST" | "COMMENT";
  target_post_id?: number | null;
  target_comment_id?: number | null;
  reason: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export type ForumCategoryType =
  | "Tất cả"
  | "Công nghệ"
  | "Văn học"
  | "Lịch sử"
  | "Khoa học"
  | "Nghệ thuật"
  | "Trao đổi";

export interface ActivityLog {
  id: number;
  type: string;
  action: string;
  user_id?: string;
  user_name?: string;
  details?: string;
  created_at: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  sort_order?: number;
  allowed_roles?: string;
  is_locked?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  sort_order?: number;
  allowed_roles?: string;
  is_locked?: boolean;
}

export interface ForumSettings {
  require_approval: boolean;
  min_post_length?: number;
  max_post_length?: number;
  allow_anonymous?: boolean;
  allowed_file_types?: string[];
  max_file_size?: number;
  [key: string]: unknown;
}
