"use client";

import { Blog } from "@/utils/types";
import { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { ThemeMode } from "@/utils/types";

const BlogItem = ({ blog }: { blog: Blog }) => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === ThemeMode.Dark;

  return (
    // <article className="container mx-auto px-4 max-w-4xl">
    //   {/* Your blog post content goes here */}
    // </article>
    <div key={blog.id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
      <div
        className={
          isDark
            ? "bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 rounded-2xl overflow-hidden h-full shadow-2xl hover:shadow-white/5 hover:-translate-y-1 transition-all duration-300 border border-zinc-700/50"
            : "bg-gray-50 rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
        }
      >
        <div className="p-6">
          <h2
            className={
              isDark
                ? "text-xl font-bold mb-2 text-zinc-100"
                : "text-xl font-bold mb-2 text-slate-800"
            }
          >
            {blog.title}
          </h2>
          <p
            className={
              isDark
                ? "text-zinc-400 leading-relaxed"
                : "text-slate-600 leading-relaxed"
            }
          >
            {blog.preview || "Lorem ipsum dolor sit amet..."}
          </p>
          <a
            href={`/blogs/${blog.id}`}
            className={
              isDark
                ? "text-zinc-300 hover:text-white mt-4 inline-block font-semibold transition-colors cursor-pointer border-b border-zinc-700 hover:border-zinc-400"
                : "text-blue-600 hover:text-blue-800 mt-4 inline-block font-semibold transition-colors cursor-pointer"
            }
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
