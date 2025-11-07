import React, { useState, useEffect, useCallback, useRef } from "react";
import { BannerConfig, defaultBannerConfig } from "../app/config/bannerConfig";
import { bannerApi } from "../features/admin/api/banner.api";
import logger from "@/shared/lib/logger";
import { BannerContext, BannerContextType } from "./BannerContext.context";

const BANNER_CACHE_KEY = "banner_cache";
const BANNER_CACHE_TTL = 5 * 60 * 1000;

interface CachedBanner {
  data: BannerConfig;
  timestamp: number;
}

const getCachedBanner = (): BannerConfig | null => {
  try {
    const cached = sessionStorage.getItem(BANNER_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as CachedBanner;
    if (Date.now() - timestamp > BANNER_CACHE_TTL) {
      sessionStorage.removeItem(BANNER_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedBanner = (data: BannerConfig): void => {
  try {
    const cached: CachedBanner = { data, timestamp: Date.now() };
    sessionStorage.setItem(BANNER_CACHE_KEY, JSON.stringify(cached));
  } catch (err) {
    logger.warn("[BannerContext] Failed to cache banner:", err);
  }
};

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bannerConfig, setBannerConfig] =
    useState<BannerConfig>(defaultBannerConfig);
  const [eventClass, setEventClass] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const preloadLinkRef = useRef<HTMLLinkElement | null>(null);
  const refreshDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadBannerConfig = useCallback(async () => {
    if (isLoadingRef.current) {
      logger.log("[BannerContext] Already loading, skip duplicate call");
      return;
    }

    const cached = getCachedBanner();
    if (cached) {
      logger.log("[BannerContext] Using cached banner data");
      if (isMountedRef.current) {
        setBannerConfig(cached);
        if (cached.eventType) {
          setEventClass(`event-${cached.eventType.toLowerCase()}`);
        } else {
          setEventClass("");
        }
        setIsLoading(false);
      }
      return;
    }

    isLoadingRef.current = true;
    try {
      setError(null);
      const banner = await bannerApi.getActiveBanner();

      if (!isMountedRef.current) return;

      if (preloadLinkRef.current) {
        preloadLinkRef.current.remove();
        preloadLinkRef.current = null;
      }

      if (banner && banner.image) {
        const preloadLink = document.createElement("link");
        preloadLink.rel = "preload";
        preloadLink.as = "image";
        preloadLink.href = banner.image;
        preloadLink.fetchPriority = "high";
        document.head.appendChild(preloadLink);
        preloadLinkRef.current = preloadLink;

        setBannerConfig(banner as BannerConfig);
        setCachedBanner(banner as BannerConfig);
        if (banner.eventType) {
          setEventClass(`event-${banner.eventType.toLowerCase()}`);
        } else {
          setEventClass("");
        }
      } else {
        setBannerConfig(defaultBannerConfig);
        setEventClass("");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error("[BannerContext] Failed to load banner:", err);
      setError(err instanceof Error ? err.message : "Failed to load banner");
      setBannerConfig(defaultBannerConfig);
      setEventClass("");
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, []);

  const refreshBanner = useCallback(async () => {
    if (refreshDebounceRef.current) {
      clearTimeout(refreshDebounceRef.current);
    }

    refreshDebounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      sessionStorage.removeItem(BANNER_CACHE_KEY);
      await loadBannerConfig();
    }, 500);
  }, [loadBannerConfig]);

  useEffect(() => {
    isMountedRef.current = true;

    loadBannerConfig();

    try {
      bcRef.current = new BroadcastChannel("banner-sync");
      bcRef.current.onmessage = (event) => {
        if (event.data === "REFRESH_BANNER") {
          logger.log("[BannerContext] Received REFRESH_BANNER message");
          refreshBanner();
        }
      };
    } catch (err) {
      logger.error("[BannerContext] Failed to create BroadcastChannel:", err);
    }

    return () => {
      isMountedRef.current = false;

      if (preloadLinkRef.current) {
        preloadLinkRef.current.remove();
        preloadLinkRef.current = null;
      }

      if (refreshDebounceRef.current) {
        clearTimeout(refreshDebounceRef.current);
      }

      if (bcRef.current) {
        try {
          bcRef.current.close();
        } catch (err) {
          logger.error(
            "[BannerContext] Failed to close BroadcastChannel:",
            err
          );
        }
      }
    };
  }, [loadBannerConfig, refreshBanner]);

  const value: BannerContextType = {
    bannerConfig,
    eventClass,
    isLoading,
    error,
    refreshBanner,
  };

  return (
    <BannerContext.Provider value={value}>{children}</BannerContext.Provider>
  );
};
