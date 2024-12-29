import { useTheme } from "next-themes";
import { useMemo } from "react";

export const useThemeHandler = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const svgClassName = useMemo(
    () => `absolute z-[3] ${isDark ? "" : "mix-blend-soft-light opacity-50"}`,
    [theme]
  );

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return { isDark, svgClassName, toggleTheme };
};
