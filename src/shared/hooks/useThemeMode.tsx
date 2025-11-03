import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.context";

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeMode phải được sử dụng trong ThemeContextProvider"
    );
  }
  return context;
};
