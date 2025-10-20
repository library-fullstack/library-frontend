import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import axiosClient from "../api/axiosClient";

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as User);
      } catch {
        // pass
      }
    }
  }, []);

  // đăng nhập
  async function login(identifier: string, password: string): Promise<void> {
    const res = await axiosClient.post<LoginResponse>("/auth/login", {
      identifier,
      password,
    });
    const { accessToken, user } = res.data;

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
    () => ({ user, token, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
