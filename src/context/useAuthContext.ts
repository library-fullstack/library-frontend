import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext.context";

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
