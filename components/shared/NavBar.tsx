"use client";
import { useContext } from "react";
import { LightDarkMode } from "./LightDarkMode";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";

const NavBar = () => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;

  return (
    <nav
      className={
        isDark
          ? "flex items-center justify-between flex-wrap bg-zinc-950/90 backdrop-blur-md p-6 border-b border-zinc-900"
          : "flex items-center justify-between flex-wrap bg-teal-600 p-6"
      }
    >
      {/* Brand / Logo */}
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a
          href="/"
          className={
            isDark
              ? "text-zinc-100 hover:text-white transition-colors"
              : "hover:text-teal-100"
          }
        >
          Personal Blog
        </a>
      </div>

      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {[
            { name: "View latest Posts", href: "/blogs" },
            { name: "Post new Blog", href: "/blogs/create" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                isDark
                  ? "inline-block mt-4 lg:mt-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 px-3 py-2 rounded-lg transition-all mr-4"
                  : "inline-block mt-4 lg:mt-0 text-teal-100 hover:text-white hover:bg-teal-700 px-3 py-2 rounded-lg transition-all mr-4"
              }
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="lg:flex lg:items-center">
          <LightDarkMode />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
