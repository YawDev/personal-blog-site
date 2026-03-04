"use client";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";
import React, { useContext } from "react";

const Loader = () => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;
  return (
    <div
      className={
        isDark
          ? "flex flex-col items-center justify-center min-h-[100vh] bg-gradient-to-br from-zinc-900 to-[#09090b] py-16"
          : "flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-teal-50 to-white py-16"
      }
    >
      <div className="relative">
        {/* Outer spinning ring - Neutral Graphite */}
        <div
          className={
            isDark
              ? "w-10 h-10 border-3 border-zinc-800 rounded-full animate-spin border-t-zinc-400"
              : "w-10 h-10 border-3 border-teal-200 rounded-full animate-spin border-t-teal-600"
          }
        ></div>

        {/* Inner pulsing dot - White Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={
              isDark
                ? "w-2 h-2 bg-zinc-100 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                : "w-2 h-2 bg-teal-600 rounded-full animate-pulse"
            }
          ></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p
          className={
            isDark
              ? "text-xl font-semibold text-zinc-100 mb-2"
              : "text-xl font-semibold text-gray-900 mb-2"
          }
        >
          Loading
        </p>
        <p className={isDark ? "text-zinc-500" : "text-gray-600"}>
          Please wait while we fetch your content...
        </p>
      </div>

      {/* Animated dots - Matte Zinc */}
      <div className="flex space-x-2 mt-4">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            style={{ animationDelay: `${delay}s` }}
            className={
              isDark
                ? "w-4 h-4 bg-zinc-600 rounded-full animate-bounce [animation-duration:1s] shadow-lg shadow-black/40"
                : "w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-duration:1s]"
            }
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
