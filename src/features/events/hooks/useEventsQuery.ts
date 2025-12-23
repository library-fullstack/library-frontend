import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../../../shared/api/events.api";
import type {
  EventListFilter,
  CreateEventInput,
  UpdateEventInput,
} from "../../../shared/types/events.types";

export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (filter: EventListFilter) => [...eventsKeys.lists(), filter] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (id: number) => [...eventsKeys.details(), id] as const,
  slug: (slug: string) => [...eventsKeys.all, "slug", slug] as const,
  upcoming: () => [...eventsKeys.all, "upcoming"] as const,
  latest: () => [...eventsKeys.all, "latest"] as const,
};

export function useEvents(filter: EventListFilter = {}) {
  return useQuery({
    queryKey: eventsKeys.list(filter),
    queryFn: async () => {
      const response = await eventsApi.getAll(filter);
      return response.data;
    },
  });
}

export function useEventDetail(id: number) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: async () => {
      const response = await eventsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useEventBySlug(slug: string) {
  return useQuery({
    queryKey: eventsKeys.slug(slug),
    queryFn: async () => {
      const response = await eventsApi.getBySlug(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useUpcomingEvents(limit: number = 5) {
  return useQuery({
    queryKey: eventsKeys.upcoming(),
    queryFn: async () => {
      const response = await eventsApi.getUpcoming(limit);
      return response.data.data;
    },
  });
}

export function useLatestEvents(limit: number = 5) {
  return useQuery({
    queryKey: eventsKeys.latest(),
    queryFn: async () => {
      const response = await eventsApi.getLatest(limit);
      return response.data.data;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const response = await eventsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventsKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventsKeys.latest() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateEventInput;
    }) => {
      const response = await eventsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: eventsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: eventsKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventsKeys.latest() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await eventsApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventsKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventsKeys.latest() });
    },
  });
}
