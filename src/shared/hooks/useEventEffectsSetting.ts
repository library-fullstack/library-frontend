import { useEffect, useState } from "react";
import { settingsApi } from "../../features/admin/api/settings.api";

export const useEventEffectsSetting = (): boolean => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const setting = await settingsApi.getSetting("disable_event_effects");
        if (setting) {
          const isDisabled = JSON.parse(setting.setting_value) as boolean;
          setIsEnabled(!isDisabled);
          localStorage.setItem(
            "disable_event_effects",
            JSON.stringify(isDisabled)
          );
        } else {
          setIsEnabled(true);
          localStorage.setItem("disable_event_effects", JSON.stringify(false));
        }
      } catch (error) {
        console.error("Lỗi khi lấy cài đặt hiệu ứng sự kiện:", error);
        setIsEnabled(true);
      }
    };

    fetchSetting();

    const handleStorageChange = () => {
      const stored = localStorage.getItem("disable_event_effects");
      if (stored) {
        const isDisabled = JSON.parse(stored) as boolean;
        setIsEnabled(!isDisabled);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isEnabled;
};
