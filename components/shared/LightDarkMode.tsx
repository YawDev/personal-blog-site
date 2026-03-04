import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";
import { useContext } from "react";

export function LightDarkMode() {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;
  return (
    <>
      <button
        className={
          isDark
            ? "inline-flex items-center px-3 py-2 text-gray-300 bg-transparent rounded-lg transition-all duration-300 hover:text-white dark:hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-95 dark:active:bg-slate-900"
            : "inline-flex items-center px-3 py-2 text-teal-100 bg-transparent rounded-lg transition-all duration-300 hover:text-white hover:bg-teal-700 hover:shadow-lg hover:scale-105 active:scale-95 active:bg-teal-800"
        }
        onClick={() =>
          themeContext?.setTheme(isDark ? ThemeMode.Light : ThemeMode.Dark)
        }
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </>
  );
}
