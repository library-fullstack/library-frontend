import { useContext } from "react";
import LoadingStateContext from "./LoadingStateContext";

export const useLoadingState = () => {
  const context = useContext(LoadingStateContext);
  if (context === undefined) {
    throw new Error("useLoadingState must be used within LoadingStateProvider");
  }
  return context;
};
