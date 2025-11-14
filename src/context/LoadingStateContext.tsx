import React, { createContext, useEffect, useState } from "react";

interface LoadingStateContextType {
  isInitialLoaderHidden: boolean;
}

export const LoadingStateContext = createContext<
  LoadingStateContextType | undefined
>(undefined);

export const LoadingStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialLoaderHidden, setIsInitialLoaderHidden] = useState(false);

  useEffect(() => {
    const handleInitialLoaderHidden = () => {
      console.log("[LoadingStateContext] Received initial-loader-hidden event");
      setIsInitialLoaderHidden(true);
    };

    window.addEventListener("initial-loader-hidden", handleInitialLoaderHidden);
    return () => {
      window.removeEventListener(
        "initial-loader-hidden",
        handleInitialLoaderHidden
      );
    };
  }, []);

  return (
    <LoadingStateContext.Provider value={{ isInitialLoaderHidden }}>
      {children}
    </LoadingStateContext.Provider>
  );
};
