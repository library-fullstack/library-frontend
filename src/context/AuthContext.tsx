import React, {
  createContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

// lưu token đăng nhập
export function AuthProvider({ children }: Props): ReactNode {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // đăng nhập - useCallback để tránh tạo function mới mỗi lần render
  const login = useCallback(
    async (identifier: string, password: string): Promise<void> => {
      const res = await axiosClient.post<LoginResponse>("/auth/login", {
        identifier,
        password,
      });
      const { accessToken, user } = res.data;

      setUser(user);
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    []
  );

  // đăng xuất - useCallback để tránh tạo function mới mỗi lần render
  const logout = useCallback((): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, logout }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
