import axiosClient from "./axiosClient";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventListFilter,
  EventListResponse,
} from "../types/events.types";

export const eventsApi = {
  getAll: (filter: EventListFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.page) params.append("page", filter.page.toString());
    if (filter.limit) params.append("limit", filter.limit.toString());
    if (filter.status) params.append("status", filter.status);
    if (filter.search) params.append("search", filter.search);
    if (filter.created_by) params.append("created_by", filter.created_by);
    if (filter.from_date) params.append("from_date", filter.from_date);
    if (filter.to_date) params.append("to_date", filter.to_date);

    return axiosClient.get<EventListResponse>(`/events?${params.toString()}`);
  },

  getById: (id: number) => {
    return axiosClient.get<{ success: boolean; data: Event }>(`/events/${id}`);
  },

  getBySlug: (slug: string) => {
    return axiosClient.get<{ success: boolean; data: Event }>(
      `/events/slug/${slug}`
    );
  },

  getUpcoming: (limit: number = 5) => {
    return axiosClient.get<{ success: boolean; data: Event[] }>(
      `/events/upcoming?limit=${limit}`
    );
  },

  getLatest: (limit: number = 5) => {
    return axiosClient.get<{ success: boolean; data: Event[] }>(
      `/events/latest?limit=${limit}`
    );
  },

  create: (data: CreateEventInput) => {
    return axiosClient.post<{ success: boolean; message: string; data: Event }>(
      "/events",
      data
    );
  },

  update: (id: number, data: UpdateEventInput) => {
    return axiosClient.put<{ success: boolean; message: string; data: Event }>(
      `/events/${id}`,
      data
    );
  },

  delete: (id: number) => {
    return axiosClient.delete<{ success: boolean; message: string }>(
      `/events/${id}`
    );
  },
};
