import { useBanner } from "../../context/useBannerContext";

export interface EventThemeConfig {
  eventType?: string;
  startDate?: string;
  endDate?: string;
}

export const useEventTheme = (): string => {
  const { eventClass } = useBanner();
  return eventClass;
};
