"use client";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";
import { useContext } from "react";

const Footer = () => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;

  return (
    <footer
      className={
        isDark
          ? "bg-zinc-950 p-8 mt-auto border-t border-zinc-900"
          : "bg-teal-600 p-8 mt-auto"
      }
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={
              isDark
                ? "font-semibold text-lg tracking-tight text-zinc-100"
                : "font-semibold text-lg tracking-tight text-white"
            }
          >
            Yaw Company
          </span>
          <span className={isDark ? "text-zinc-800" : "text-teal-100"}>|</span>
          <p className={isDark ? "text-zinc-500" : "text-white"}>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="flex gap-6">
          {[
            { name: "About", href: "#about" },
            { name: "Privacy", href: "#privacy" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                isDark
                  ? "text-zinc-400 hover:text-white transition-colors duration-200"
                  : "text-teal-100 hover:text-white transition-colors duration-200"
              }
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
