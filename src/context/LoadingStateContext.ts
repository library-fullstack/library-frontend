import { createContext } from "react";

interface LoadingStateContextType {
  isInitialLoaderHidden: boolean;
}

const defaultValue: LoadingStateContextType = {
  isInitialLoaderHidden: false,
};

const LoadingStateContext =
  createContext<LoadingStateContextType>(defaultValue);

export type { LoadingStateContextType };
export default LoadingStateContext;
