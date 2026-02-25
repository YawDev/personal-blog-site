"use client";
import BlogList from "@/components/blog/Blogs";
import { useState, useEffect } from "react";
import { Blog } from "../utils/types";
import { blogsData } from "../utils/InMemory";
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(blogsData);

  return (
    <>
      <BlogList blogs={blogs} />
    </>
  );
}
