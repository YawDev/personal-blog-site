import { ThemeMode } from "@/utils/types";
import { createContext } from "react";

export interface IThemeContext {
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
}

const ThemeContext = createContext<IThemeContext | null>(null);

export default ThemeContext;
