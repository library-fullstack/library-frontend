import { useEffect, useState } from "react";

export interface EventThemeConfig {
  eventType?: string;
  startDate?: string;
  endDate?: string;
}

export const useEventTheme = (): string => {
  const [eventClass, setEventClass] = useState("");

  useEffect(() => {
    const loadEventTheme = async () => {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
        const response = await fetch(`${apiBaseUrl}/banners/active`);

        if (!response.ok) {
          setEventClass("");
          return;
        }

        const data = await response.json();
        const banner = data.data || data;

        if (banner?.eventType) {
          setEventClass(`event-${banner.eventType.toLowerCase()}`);
        } else {
          setEventClass("");
        }
      } catch (err) {
        console.error("[useEventTheme] Failed to load event theme:", err);
        setEventClass("");
      }
    };

    loadEventTheme();

    const bc = new BroadcastChannel("banner-sync");
    bc.onmessage = (event) => {
      if (event.data === "REFRESH_BANNER") {
        console.log("[useEventTheme] Received REFRESH_BANNER broadcast");
        loadEventTheme();
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  return eventClass;
};
