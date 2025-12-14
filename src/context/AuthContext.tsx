import React, {
  useMemo,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axiosClient from "../shared/api/axiosClient";
import StorageUtil from "../shared/lib/storage";
import logger from "../shared/lib/logger";
import { usersApi } from "../features/users/api/users.api";
import { queryClient } from "../shared/lib/queryClient";
import { clearPersistCache } from "../shared/lib/queryPersist";
import { STORAGE_KEYS } from "../shared/lib/storageKeys";
import {
  AuthContext,
  type User,
  type AuthContextValue,
} from "./AuthContext.context";

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isRefreshingRef = React.useRef(false);
  const hasInitializedRef = React.useRef(false);
  const refreshPromiseRef = React.useRef<Promise<void> | null>(null);

  // làm mới user
  const refreshUser = useCallback(async () => {
    if (refreshPromiseRef.current) {
      logger.debug("[AuthProvider] refreshUser: waiting for existing refresh");
      return refreshPromiseRef.current;
    }

    const storedToken = StorageUtil.getItem(STORAGE_KEYS.auth.token);
    if (!storedToken) {
      logger.debug("[AuthProvider] refreshUser skipped (no token)");
      return;
    }

    refreshPromiseRef.current = (async () => {
      try {
        isRefreshingRef.current = true;
        const userPromise = usersApi.getMe();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("User load timeout")), 3000)
        );

        const res = (await Promise.race([
          userPromise,
          timeoutPromise,
        ])) as unknown as { data: User };
        setUser(res.data);
      } catch (err) {
        logger.error("[AuthProvider] refreshUser failed:", err);

        const errorMsg = err instanceof Error ? err.message : String(err);
        if (
          errorMsg.includes("401") ||
          errorMsg.includes("Token invalid") ||
          errorMsg.includes("token might be invalid")
        ) {
          logger.warn("[AuthProvider] Token invalid, clearing auth data");
          StorageUtil.removeItem(STORAGE_KEYS.auth.token);
          setToken(null);
          setUser(null);
        }
      } finally {
        isRefreshingRef.current = false;
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, []);

  // localstorage
  useEffect(() => {
    if (hasInitializedRef.current) {
      logger.debug("[AuthProvider] Already initialized, skip duplicate call");
      return;
    }
    hasInitializedRef.current = true;

    const initAuth = async () => {
      try {
        const storedToken = StorageUtil.getItem(STORAGE_KEYS.auth.token);

        if (storedToken) {
          setToken(storedToken);

          logger.debug("[AuthProvider] Token restored, fetching user data...");
          const userPromise = usersApi.getMe();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("User load timeout")), 3000)
          );
          try {
            const res = (await Promise.race([
              userPromise,
              timeoutPromise,
            ])) as unknown as { data: User };
            setUser(res.data);
            logger.debug(
              "[AuthProvider] User data loaded on init:",
              res.data.email
            );
          } catch (err) {
            logger.error("[AuthProvider] Failed to load user on init:", err);
            StorageUtil.removeItem(STORAGE_KEYS.auth.token);
            setToken(null);
          }
        }
      } catch (err) {
        logger.error("[AuthProvider] Error loading user/token:", err);
        StorageUtil.removeItem("user");
        StorageUtil.removeItem(STORAGE_KEYS.auth.token);
      }

      const loader = document.getElementById("initial-loader");
      if (loader) {
        setTimeout(() => {
          loader.classList.add("hidden");
          setTimeout(() => {
            loader.remove();
          }, 500);
        }, 300);
      }

      setInitialized(true);
    };

    if (import.meta.env.DEV && initialized) {
      logger.debug("[AuthProvider] HMR detected, keeping initialized state");
      return;
    }

    queueMicrotask(initAuth);
  }, [initialized]);

  // đồng bộ realtime user
  useEffect(() => {
    let focusTimeout: ReturnType<typeof setTimeout>;
    let lastFocusTime = 0;
    const FOCUS_DEBOUNCE_MS = 30000;
    let visibilityChangeTimeout: ReturnType<typeof setTimeout>;

    const handleFocus = () => {
      if (import.meta.env.DEV) {
        logger.debug("[AuthProvider] Skip auto-refresh in development");
        return;
      }

      const now = Date.now();
      if (now - lastFocusTime < FOCUS_DEBOUNCE_MS) {
        logger.debug("[AuthProvider] Focus debounced, skip refresh");
        return;
      }

      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        if (document.visibilityState === "visible") {
          lastFocusTime = Date.now();
          logger.debug("[AuthProvider] Refreshing user on focus");
          refreshUser();
        }
      }, 500);
    };

    const handleVisibilityChange = () => {
      clearTimeout(visibilityChangeTimeout);

      if (document.visibilityState === "visible") {
        logger.debug("[AuthProvider] App is now visible, checking auth state");

        visibilityChangeTimeout = setTimeout(() => {
          const storedToken = StorageUtil.getItem(STORAGE_KEYS.auth.token);

          if (storedToken && token) {
            logger.debug(
              "[AuthProvider] Token exists, checking if still valid"
            );

            const now = Date.now();
            if (now - lastFocusTime >= FOCUS_DEBOUNCE_MS) {
              lastFocusTime = Date.now();
              refreshUser();
            }
          } else if (!storedToken && user) {
            logger.warn(
              "[AuthProvider] Token missing but user exists, clearing"
            );
            setUser(null);
            setToken(null);
          }
        }, 300);
      }
    };

    const handleLogout = () => {
      logger.debug("[AuthProvider] Received logout event from axiosClient");
      setUser(null);
      setToken(null);
      StorageUtil.removeItem("token");
    };

    if (token && !import.meta.env.DEV) {
      window.addEventListener("focus", handleFocus);
      window.addEventListener("visibilitychange", handleVisibilityChange);
    }

    window.addEventListener("auth-logout", handleLogout);

    const bc = new BroadcastChannel("user-sync");
    bc.onmessage = (event) => {
      const message = event.data;

      if (message === "LOGOUT" || message?.type === "LOGOUT") {
        logger.debug(
          "[AuthProvider] Received LOGOUT broadcast, clearing session"
        );
        setUser(null);
        setToken(null);
        StorageUtil.removeItem("token");
        return;
      }

      if (message?.type === "AVATAR_UPDATE") {
        logger.debug(
          "[AuthProvider] Received AVATAR_UPDATE broadcast:",
          message.avatar_url
        );
        setUser((prev) => {
          if (!prev) return prev;
          return { ...prev, avatar_url: message.avatar_url };
        });
        return;
      }

      if (import.meta.env.DEV) {
        logger.debug("[AuthProvider] Skipping broadcast refresh in dev mode");
        return;
      }

      if (message === "REFRESH_USER" || message?.type === "REFRESH_USER") {
        logger.debug("[AuthProvider] Received REFRESH_USER broadcast");

        const currentToken = StorageUtil.getItem(STORAGE_KEYS.auth.token);
        if (!currentToken) {
          logger.debug("[AuthProvider] Broadcast refresh skipped (no token)");
          return;
        }

        clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
          refreshUser();
        }, 800);
      }
    };

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("auth-logout", handleLogout);
      clearTimeout(focusTimeout);
      clearTimeout(visibilityChangeTimeout);
      bc.close();
    };
  }, [refreshUser, token, user]);

  // login / logout
  const login = useCallback(async (identifier: string, password: string) => {
    try {
      logger.debug("[AuthProvider] Starting login, clearing old session data");

      try {
        await axiosClient.post("/auth/logout", {}, { withCredentials: true });
        logger.debug("[AuthProvider] Backend session cleared");
      } catch (err) {
        logger.warn("[AuthProvider] Backend logout before login failed:", err);
      }

      setToken(null);
      setUser(null);
      StorageUtil.removeItem(STORAGE_KEYS.auth.token);
      StorageUtil.removeItem("user");
      localStorage.removeItem(STORAGE_KEYS.cart.state);
      clearPersistCache();

      queryClient.clear();
      logger.debug("[AuthProvider] Cleared old account cache before login");

      await new Promise((resolve) => setTimeout(resolve, 200));

      const res = await axiosClient.post<LoginResponse>("/auth/login", {
        identifier,
        password,
      });

      const { accessToken, user } = res.data;

      logger.debug(
        "[AuthProvider] Login successful, setting new user:",
        user.email
      );

      setToken(accessToken);
      setUser(user);
      StorageUtil.setItem("token", accessToken);

      try {
        const bc = new BroadcastChannel("user-sync");
        bc.postMessage({ type: "LOGIN", user });
        bc.close();
      } catch (err) {
        logger.warn("[AuthProvider] BroadcastChannel not available:", err);
      }
    } catch (err) {
      logger.error("[AuthProvider] Login failed:", err);
      setToken(null);
      setUser(null);
      StorageUtil.removeItem(STORAGE_KEYS.auth.token);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    logger.debug("[AuthProvider] Logging out, clearing all session data");
    setUser(null);
    setToken(null);
    StorageUtil.removeItem(STORAGE_KEYS.auth.token);

    localStorage.removeItem(STORAGE_KEYS.cart.state);

    clearPersistCache();
    queryClient.clear();
    logger.debug("[AuthProvider] Cleared React Query cache");

    try {
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 1,
        },
      });
    } catch (err) {
      logger.warn("[AuthProvider] Failed to reset queryClient options:", err);
    }

    try {
      await axiosClient.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      logger.warn("[AuthProvider] Backend logout failed:", err);
    }

    try {
      const bc = new BroadcastChannel("user-sync");
      bc.postMessage({ type: "LOGOUT" });
      bc.close();
    } catch (err) {
      logger.warn("[AuthProvider] BroadcastChannel not available:", err);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      logout,
      setUser,
      refreshUser,
      isInitialized: initialized,
      isAuthenticated: !!user,
    }),
    [user, token, login, logout, refreshUser, initialized]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.displayName = "AuthProvider";

export default AuthProvider;

export type { User } from "./AuthContext.context";
