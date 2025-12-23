import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsApi } from "../../../shared/api/news.api";
import type {
  NewsListFilter,
  CreateNewsInput,
  UpdateNewsInput,
} from "../../../shared/types/news.types";

export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filter: NewsListFilter) => [...newsKeys.lists(), filter] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (id: number) => [...newsKeys.details(), id] as const,
  slug: (slug: string) => [...newsKeys.all, "slug", slug] as const,
  latest: () => [...newsKeys.all, "latest"] as const,
};

export function useNews(filter: NewsListFilter = {}) {
  return useQuery({
    queryKey: newsKeys.list(filter),
    queryFn: async () => {
      const response = await newsApi.getAll(filter);
      return response.data;
    },
  });
}

export function useNewsDetail(id: number) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: async () => {
      const response = await newsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: newsKeys.slug(slug),
    queryFn: async () => {
      const response = await newsApi.getBySlug(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useLatestNews(limit: number = 5) {
  return useQuery({
    queryKey: newsKeys.latest(),
    queryFn: async () => {
      const response = await newsApi.getLatest(limit);
      return response.data.data;
    },
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsInput) => {
      const response = await newsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsKeys.latest() });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateNewsInput }) => {
      const response = await newsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: newsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: newsKeys.latest() });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await newsApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsKeys.latest() });
    },
  });
}
