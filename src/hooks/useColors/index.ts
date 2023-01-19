import { useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

const useColors = () => {
  const theme = useMantineTheme();

  const darkMode = useMemo(() => {
    return theme.colorScheme === "dark";
  }, [theme.colorScheme]);

  return useMemo(() => {
    const background = darkMode ? "#141517" : "#f8f9fa";
    const navbar = darkMode ? "#1A1B1E" : "#ffffff";
    const border = darkMode ? "#2C2E33" : "#e9ecef";

    return {
      darkMode,
      themeColors: theme.colors,
      customColors: { background, navbar, border },
    };
  }, [theme.colors, darkMode]);
};

export default useColors;
