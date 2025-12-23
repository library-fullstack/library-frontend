import axiosClient from "./axiosClient";
import type {
  News,
  CreateNewsInput,
  UpdateNewsInput,
  NewsListFilter,
  NewsListResponse,
} from "../types/news.types";

export const newsApi = {
  getAll: (filter: NewsListFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.page) params.append("page", filter.page.toString());
    if (filter.limit) params.append("limit", filter.limit.toString());
    if (filter.category) params.append("category", filter.category);
    if (filter.status) params.append("status", filter.status);
    if (filter.search) params.append("search", filter.search);
    if (filter.author_id) params.append("author_id", filter.author_id);

    return axiosClient.get<NewsListResponse>(`/news?${params.toString()}`);
  },

  getById: (id: number) => {
    return axiosClient.get<{ success: boolean; data: News }>(`/news/${id}`);
  },

  getBySlug: (slug: string) => {
    return axiosClient.get<{ success: boolean; data: News }>(
      `/news/slug/${slug}`
    );
  },

  getLatest: (limit: number = 5) => {
    return axiosClient.get<{ success: boolean; data: News[] }>(
      `/news/latest?limit=${limit}`
    );
  },

  create: (data: CreateNewsInput) => {
    return axiosClient.post<{ success: boolean; message: string; data: News }>(
      "/news",
      data
    );
  },

  update: (id: number, data: UpdateNewsInput) => {
    return axiosClient.put<{ success: boolean; message: string; data: News }>(
      `/news/${id}`,
      data
    );
  },

  delete: (id: number) => {
    return axiosClient.delete<{ success: boolean; message: string }>(
      `/news/${id}`
    );
  },
};
