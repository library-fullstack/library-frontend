export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  status: EventStatus;
  created_by: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_email?: string;
  creator_avatar?: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  status?: EventStatus;
  thumbnail_url?: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  status?: EventStatus;
  thumbnail_url?: string;
}

export interface EventListFilter {
  page?: number;
  limit?: number;
  status?: EventStatus;
  search?: string;
  created_by?: string;
  from_date?: string;
  to_date?: string;
}

export interface EventListResponse {
  success: boolean;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
