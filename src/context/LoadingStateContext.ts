import { createContext } from "react";

interface LoadingStateContextType {
  isInitialLoaderHidden: boolean;
}

const LoadingStateContext = createContext<LoadingStateContextType | undefined>(
  undefined
);

export default LoadingStateContext;
