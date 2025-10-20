import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phải ở trong <AuthProvider>");
  }
  return ctx;
}
