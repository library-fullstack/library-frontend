import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import type { User } from "../api/users.api";
import StorageUtil from "../../../shared/lib/storage";
import logger from "../../../shared/lib/logger";
import { CACHE_TIMES } from "../../../shared/lib/cacheTimes";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function useCurrentUser() {
  const token = StorageUtil.getItem(STORAGE_KEYS.auth.token);

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const currentToken = StorageUtil.getItem(STORAGE_KEYS.auth.token);
      logger.debug(
        "[useCurrentUser] Calling API with token:",
        currentToken?.substring(0, 20) + "..."
      );
      const response = await usersApi.getMe();
      logger.debug(
        "[useCurrentUser] Fetched user from API:",
        response.data.email,
        response.data.id
      );
      return response.data;
    },
    enabled: !!token,
    ...CACHE_TIMES.NORMAL,
    retry: 1,
    initialData: undefined,
    notifyOnChangeProps: ["data", "isLoading"],
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      logger.debug("[useUpdateAvatar] Uploading avatar");
      const response = await usersApi.updateAvatar(formData);
      return response.data;
    },
    onSuccess: (data) => {
      logger.debug("[useUpdateAvatar] Avatar updated successfully");

      queryClient.setQueryData<User>(userKeys.me(), (old) => {
        if (!old) return old;
        return { ...old, avatar_url: data.avatar_url };
      });

      queryClient.invalidateQueries({ queryKey: userKeys.me() });

      try {
        const bc = new BroadcastChannel("user-sync");
        bc.postMessage({ type: "AVATAR_UPDATE", avatar_url: data.avatar_url });
        bc.close();
      } catch (err) {
        logger.warn("[useUpdateAvatar] BroadcastChannel not available:", err);
      }
    },
    onError: (error) => {
      logger.error("[useUpdateAvatar] Upload failed:", error);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      old_password: string;
      new_password: string;
      otp_code: string;
    }) => {
      const response = await usersApi.verifyChangePassword(data);
      return response.data;
    },
  });
}

export function clearUserQueryCache(
  queryClient?: ReturnType<typeof useQueryClient>
) {
  logger.debug("[clearUserQueryCache] Clearing user-related queries");
  if (queryClient) {
    queryClient.removeQueries({ queryKey: userKeys.all });
  }
}
