import * as React from "react";

export const AuthSnackbarContext = React.createContext<{
  showSnackbar: (
    message: string,
    severity: "success" | "error" | "info"
  ) => void;
}>({
  showSnackbar: () => {},
});

export const useAuthSnackbar = () => React.useContext(AuthSnackbarContext);
