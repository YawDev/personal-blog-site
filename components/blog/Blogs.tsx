"use client";

import { Blog } from "@/app/utils/types";
import BlogItem from "./BlogItem";
import ShowMoreButton from "./ShowMore";
import { FormMode } from "@/app/utils/FormHelpers";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/app/utils/LocalStorage";
const BlogList = ({ fetchedBlogs }: { fetchedBlogs: Blog[] }) => {
  const [mode, setMode] = useState<FormMode>(FormMode.Create);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove localStorage once API is integrated and replace with fetchedBlogs
    const storedBlogs =
      fetchedBlogs?.length > 0 ? fetchedBlogs : getFromLocalStorage("blogs");

    const blogsData: Blog[] = storedBlogs ? JSON.parse(storedBlogs) : [];
    setBlogs(blogsData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // Let the server loading handle this
  }

  return blogs?.length === 0 ? (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Posts</h2>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-semibold text-gray-900 mb-4">
          No Articles Yet
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Be the first to share your insights! Create your first article to get
          started.
        </p>
        <a
          href="/blogs/create"
          className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Your First Article
        </a>
      </div>
    </section>
  ) : (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Posts</h2>
      </div>
      <div className="flex flex-wrap -mx-4">
        {blogs.map((blog) => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <ShowMoreButton />
      </div>
    </section>
  );
};

export default BlogList;
