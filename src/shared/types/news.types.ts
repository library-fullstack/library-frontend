export enum NewsCategory {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  GUIDE = "GUIDE",
  UPDATE = "UPDATE",
  OTHER = "OTHER",
}

export enum NewsStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: NewsCategory;
  status: NewsStatus;
  author_id: string | null;
  thumbnail_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_email?: string;
  author_avatar?: string;
}

export interface CreateNewsInput {
  title: string;
  content: string;
  category: NewsCategory;
  status?: NewsStatus;
  thumbnail_url?: string;
}

export interface UpdateNewsInput {
  title?: string;
  content?: string;
  category?: NewsCategory;
  status?: NewsStatus;
  thumbnail_url?: string;
}

export interface NewsListFilter {
  page?: number;
  limit?: number;
  category?: NewsCategory;
  status?: NewsStatus;
  search?: string;
  author_id?: string;
}

export interface NewsListResponse {
  success: boolean;
  data: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
