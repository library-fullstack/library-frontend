import { useContext } from "react";
import { BannerContext, BannerContextType } from "./BannerContext.context";

export const useBanner = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBanner must be used within a BannerProvider");
  }
  return context;
};
