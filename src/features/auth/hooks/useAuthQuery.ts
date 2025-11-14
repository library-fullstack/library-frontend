import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../shared/api/axiosClient";
import StorageUtil from "../../../shared/lib/storage";
import logger from "../../../shared/lib/logger";
import { userKeys } from "../../users/hooks/useUser";
import { cartKeys } from "../../borrow/components/hooks/useCart";
import type { User } from "../../users/api/users.api";

interface LoginResponse {
  accessToken: string;
  user: User;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { identifier: string; password: string }) => {
      logger.debug("[useLogin] Starting login");

      StorageUtil.removeItem("token");
      StorageUtil.removeItem("user");

      await new Promise((resolve) => setTimeout(resolve, 50));

      const res = await axiosClient.post<LoginResponse>("/auth/login", {
        identifier: params.identifier,
        password: params.password,
      });

      return res.data;
    },
    onSuccess: (data) => {
      logger.debug("[useLogin] Login successful:", data.user.email);

      StorageUtil.setItem("token", data.accessToken);

      queryClient.setQueryData(userKeys.me(), data.user);

      queryClient.invalidateQueries({ queryKey: cartKeys.list() });

      try {
        const bc = new BroadcastChannel("user-sync");
        bc.postMessage({ type: "LOGIN", user: data.user });
        bc.close();
      } catch (err) {
        logger.warn("[useLogin] BroadcastChannel not available:", err);
      }
    },
    onError: (err) => {
      logger.error("[useLogin] Login failed:", err);
      StorageUtil.removeItem("token");
      StorageUtil.removeItem("user");
      queryClient.setQueryData(userKeys.me(), null);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      logger.debug("[useLogout] Starting logout request to backend");

      try {
        await axiosClient.post("/auth/logout", {}, { withCredentials: true });
      } catch (err) {
        logger.warn("[useLogout] Backend logout failed:", err);
      }

      logger.debug("[useLogout] Clearing local auth state");
      StorageUtil.removeItem("token");
      StorageUtil.removeItem("user");

      queryClient.setQueryData(userKeys.me(), null);

      queryClient.setQueryData(cartKeys.list(), {
        items: [],
        totalBooks: 0,
        totalCopies: 0,
      });

      queryClient.clear();

      try {
        const bc = new BroadcastChannel("user-sync");
        bc.postMessage({ type: "LOGOUT" });
        bc.close();
      } catch (err) {
        logger.warn("[useLogout] BroadcastChannel not available:", err);
      }
    },
    onSuccess: () => {
      logger.debug("[useLogout] Logout successful");
      navigate("/auth/login");
    },
    onError: (err) => {
      logger.error("[useLogout] Logout error:", err);
      navigate("/auth/login");
    },
  });
}
