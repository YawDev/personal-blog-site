"use client";

import { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;

  return (
    <main
      className={
        isDark ? "bg-gradient-to-br from-slate-800/80 to-zinc-950" : "flex-grow"
      }
    >
      {children}
    </main>
  );
}
