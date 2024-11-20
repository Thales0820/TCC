"use client"; // O "ThemeProvider" precisa ser cliente para funcionar corretamente.
import { useTheme } from "@/hooks/useTheme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
};