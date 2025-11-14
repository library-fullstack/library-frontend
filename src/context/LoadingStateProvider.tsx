import React, { useEffect, useState } from "react";
import LoadingStateContext from "./LoadingStateContext";

const LoadingStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialLoaderHidden, setIsInitialLoaderHidden] = useState(false);

  useEffect(() => {
    const handleInitialLoaderHidden = () => {
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

export default LoadingStateProvider;
