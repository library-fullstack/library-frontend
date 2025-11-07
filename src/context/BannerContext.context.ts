import { createContext } from "react";
import { BannerConfig } from "../app/config/bannerConfig";

export interface BannerContextType {
  bannerConfig: BannerConfig;
  eventClass: string;
  isLoading: boolean;
  error: string | null;
  refreshBanner: () => Promise<void>;
}

export const BannerContext = createContext<BannerContextType | undefined>(
  undefined
);
