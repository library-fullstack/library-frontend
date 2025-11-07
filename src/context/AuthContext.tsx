import React, {
  createContext,
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

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  student_id?: string;
  avatar_url?: string;
  phone?: string;
  class_name?: string;
  faculty?: string;
  major?: string;
  admission_year?: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isRefreshingRef = React.useRef(false);
  const hasInitializedRef = React.useRef(false);

  // làm mới user
  const refreshUser = useCallback(async () => {
    if (isRefreshingRef.current) {
      logger.log("[AuthProvider] refreshUser skipped (already running)");
      return;
    }

    const token = StorageUtil.getItem("token");
    if (!token) {
      logger.warn("[AuthProvider] refreshUser skipped (no token)");
      return;
    }

    try {
      isRefreshingRef.current = true;
      const res = await usersApi.getMe();
      setUser(res.data);
      StorageUtil.setJSON("user", res.data);
    } catch (err) {
      logger.error("[AuthProvider] refreshUser failed:", err);
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // localstorage
  useEffect(() => {
    if (hasInitializedRef.current) {
      logger.log("[AuthProvider] Already initialized, skip duplicate call");
      return;
    }
    hasInitializedRef.current = true;

    const initAuth = async () => {
      try {
        const storedUser = StorageUtil.getItem("user");
        const storedToken = StorageUtil.getItem("token");

        if (storedToken) {
          setToken(storedToken);
          try {
            const res = await usersApi.getMe();
            setUser(res.data);
            StorageUtil.setJSON("user", res.data);
          } catch (err) {
            logger.warn("[AuthProvider] getMe failed:", err);
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch (parseErr) {
                logger.error(
                  "[AuthProvider] Failed to parse stored user:",
                  parseErr
                );
                StorageUtil.removeItem("user");
              }
            }
          }
        }
      } catch (err) {
        logger.error("[AuthProvider] Error loading user/token:", err);
        StorageUtil.removeItem("user");
        StorageUtil.removeItem("token");
      }

      const loader = document.getElementById("initial-loader");
      if (loader) {
        setTimeout(() => {
          loader.classList.add("hidden");
          setTimeout(() => loader.remove(), 500);
        }, 100);
      }

      setInitialized(true);
    };
    queueMicrotask(initAuth);
  }, []);

  // đồng bộ realtime user
  useEffect(() => {
    let focusTimeout: ReturnType<typeof setTimeout>;
    let lastFocusTime = 0;
    const FOCUS_DEBOUNCE_MS = 10000;

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusTime < FOCUS_DEBOUNCE_MS) {
        logger.log("[AuthProvider] Focus debounced, skip refresh");
        return;
      }

      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        if (document.visibilityState === "visible") {
          lastFocusTime = Date.now();
          logger.log("[AuthProvider] Refreshing user on focus");
          refreshUser();
        }
      }, 500);
    };

    if (token) {
      window.addEventListener("focus", handleFocus);
    }

    const bc = new BroadcastChannel("user-sync");
    bc.onmessage = (event) => {
      if (event.data === "REFRESH_USER") {
        logger.log("[AuthProvider] Received REFRESH_USER broadcast");
        clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
          refreshUser();
        }, 800);
      }
    };

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearTimeout(focusTimeout);
      bc.close();
    };
  }, [refreshUser, token]);

  // login / logout
  const login = useCallback(async (identifier: string, password: string) => {
    const res = await axiosClient.post<LoginResponse>("/auth/login", {
      identifier,
      password,
    });
    const { accessToken, user } = res.data;
    setUser(user);
    setToken(accessToken);
    StorageUtil.setItem("token", accessToken);
    StorageUtil.setJSON("user", user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    StorageUtil.removeItem("token");
    StorageUtil.removeItem("user");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, logout, setUser, refreshUser }),
    [user, token, login, logout, refreshUser]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
