import { Blog } from "@/types/types";
import BlogDetails from "@/components/blog/BlogDetails";
import { Metadata } from "next";
import { fetchPostById } from "@/utils/serverApi";
import { getInitialUser } from "@/utils/authUtil";

// Static metadata — no async awaits, so the title lands in the initial HTML
// and the browser tab never falls back to the URL. BlogDetails updates the
// document title client-side once the post is known.
export const metadata: Metadata = {
  title: "Article",
  description: "Read this article on Personal Blog",
};

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
