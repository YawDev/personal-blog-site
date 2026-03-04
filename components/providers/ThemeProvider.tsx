"use client";

import { useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.Dark);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
