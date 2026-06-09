import { Blog } from "@/types/types";
import BlogDetails from "@/components/blog/BlogDetails";
import { Metadata } from "next";
import { fetchPostById } from "@/utils/serverApi";
import { getInitialUser } from "@/utils/authUtil";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchPostById(id);
  if (!blog) return { title: { absolute: "404 | Not Found" } };
  return {
    title: blog.title ?? "Article",
    description: "Read this article on Personal Blog",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getInitialUser();
  const isLoggedIn = !!user;
  const { id } = await params;
  let fetchedBlog: Blog | null = await fetchPostById(id);
  if (!fetchedBlog) {
    //If blog isnt found, redirect to not found
    notFound();
  }

  const isAuthor = user && fetchedBlog && user.id === fetchedBlog.userId;

  return (
    <>
      <BlogDetails
        fetchedBlog={fetchedBlog}
        isLoggedIn={isLoggedIn}
        isAuthor={isAuthor}
      />
    </>
  );
}
