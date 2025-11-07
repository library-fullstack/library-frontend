import { useEffect, useState } from "react";
import { settingsApi } from "../../features/admin/api/settings.api";
import StorageUtil from "../lib/storage";
import logger from "@/shared/lib/logger";

export const useEventEffectsSetting = (): boolean => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const setting = await settingsApi.getSetting("disable_event_effects");
        if (setting) {
          try {
            const isDisabled = JSON.parse(setting.setting_value) as boolean;
            setIsEnabled(!isDisabled);
            StorageUtil.setItem(
              "disable_event_effects",
              JSON.stringify(isDisabled)
            );
          } catch (parseErr) {
            logger.error("Failed to parse event effects setting:", parseErr);
            setIsEnabled(true);
          }
        } else {
          setIsEnabled(true);
          StorageUtil.setItem("disable_event_effects", JSON.stringify(false));
        }
      } catch (error) {
        logger.error("Error fetching event effects setting:", error);
        setIsEnabled(true);
      }
    };

    fetchSetting();

    const handleStorageChange = () => {
      const stored = StorageUtil.getItem("disable_event_effects");
      if (stored) {
        try {
          const isDisabled = JSON.parse(stored) as boolean;
          setIsEnabled(!isDisabled);
        } catch (parseErr) {
          logger.error("Failed to parse stored event effects setting:", parseErr);
          setIsEnabled(true);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isEnabled;
};
