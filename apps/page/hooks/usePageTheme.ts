import { useTheme } from "next-themes";
import { useEffect } from "react";

export function usePageTheme(colorScheme?: string) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (colorScheme && colorScheme !== "auto") {
      setTheme(colorScheme);
    }
  }, [colorScheme, setTheme]);
}