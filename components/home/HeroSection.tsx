"use client";
import { useContext } from "react";
import { ThemeMode } from "@/utils/types";
import ThemeContext from "@/context/ThemeContext";

const HeroSection = () => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;
  return (
    <section
      className={
        isDark
          ? "bg-gradient-to-br from-slate-800/80 via-zinc-900 to-zinc-950 py-20 px-6 lg:px-8 border-b border-zinc-800/50"
          : "bg-gradient-to-br from-teal-50 to-white py-20 px-6 lg:px-8"
      }
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className={
            isDark
              ? "text-4xl md:text-6xl font-bold text-zinc-100 mb-6 leading-tight"
              : "text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          }
        >
          Insights, Ideas, and{" "}
          <span
            className={
              isDark
                ? "text-zinc-400 bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-500"
                : "text-teal-600"
            }
          >
            Innovation
          </span>
        </h1>
        <p
          className={
            isDark
              ? "text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed max-w-3xl mx-auto"
              : "text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          }
        >
          Exploring the intersection of technology, creativity, and professional
          growth through thoughtful analysis and practical insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/blogs"
            className={
              isDark
                ? "bg-zinc-100 text-zinc-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                : "bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            }
          >
            Read Latest Articles
          </a>
          <a
            href="#featured"
            className={
              isDark
                ? "border-2 border-zinc-700 text-zinc-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-zinc-800 hover:text-white transition-all duration-300"
                : "border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 hover:text-white transition-colors duration-300"
            }
          >
            Featured Content
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { label: "Quality Articles", value: "50+" },
            { label: "Monthly Readers", value: "10K+" },
            { label: "Years Experience", value: "5+" },
          ].map((stat, i) => (
            <div key={i} className="p-6">
              <div
                className={
                  isDark
                    ? "text-3xl font-bold text-zinc-200 mb-2"
                    : "text-3xl font-bold text-teal-600 mb-2"
                }
              >
                {stat.value}
              </div>
              <div
                className={
                  isDark ? "text-zinc-500 font-medium" : "text-gray-600"
                }
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
