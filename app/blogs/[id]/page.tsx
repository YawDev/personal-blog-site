import { getFromLocalStorage } from "@/app/utils/LocalStorage";
import { Blog } from "@/app/utils/types";
import BlogDetails from "@/components/blog/BlogDetails";
import { Metadata } from "next";

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

  console.log(id);

  let fetchedBlog: Blog | null = null;

  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <>
      <BlogDetails
        fetchedBlog={
          fetchedBlog || {
            id: id, // Using passed ID to get blog from localStorage in client component
            title: "Here is a sample blog post", // Placeholder title
            datePosted: new Date().toISOString(), // Placeholder date
            content: "This is the content of the blog post.", // Placeholder content
            preview: "This is the preview of the blog post.", // Placeholder preview
          }
        }
      />
    </>
  );
}
