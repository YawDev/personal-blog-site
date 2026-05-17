import { Blog } from "@/types/types";
import BlogDetails from "@/components/blog/BlogDetails";
import { Metadata } from "next";
import { GetPostsById } from "@/service/PersonalBlogService";

export const metadata: Metadata = {
  title: "Post Details",
  description: "Blog Post Details",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let fetchedBlog: Blog | null = await GetPostsById(id);
  if (!fetchedBlog) {
    //If blog isnt found, redirect to not found
  }
  return (
    <>
      <BlogDetails fetchedBlog={fetchedBlog} />
    </>
  );
}
