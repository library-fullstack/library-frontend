import React, {
  createContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosClient from "../shared/api/axiosClient";

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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // đọc token + user từ localStorage
  useEffect(() => {
    console.log("[AuthProvider] Initializing...");

    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error("[AuthProvider] Error loading user/token:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      // ẩn loader sau khi init xong
      const loader = document.getElementById("initial-loader");
      if (loader) {
        console.log("[AuthProvider] Hiding initial loader");
        setTimeout(() => {
          loader.classList.add("hidden");
          setTimeout(() => {
            loader.remove();
            console.log("[AuthProvider] Initial loader removed");
          }, 500);
        }, 100);
      }

      setInitialized(true);
      console.log("[AuthProvider] Initialization complete");
    };
    queueMicrotask(initAuth);
  }, []);

  // đăng nhập
  async function login(identifier: string, password: string): Promise<void> {
    console.log("[AuthProvider] Login attempt for:", identifier);

    const res = await axiosClient.post<LoginResponse>("/auth/login", {
      identifier,
      password,
    });
    const { accessToken, user } = res.data;

    console.log("[AuthProvider] Login successful, user:", user.full_name);

    setUser(user);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  // đăng xuất
  function logout(): void {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, logout, setUser }),
    [user, token]
  );

  if (!initialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
