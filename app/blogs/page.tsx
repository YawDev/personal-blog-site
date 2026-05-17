import BlogList from "@/components/blog/Blogs";
import { Blog } from "../../types/types";
import { GetAllPosts } from "@/service/PersonalBlogService";
import { getInitialUser } from "@/utils/authUtil";

export default async function BlogsPage() {
  const [fetchedBlogs, user] = await Promise.all([
    GetAllPosts(),
    getInitialUser(),
  ]);

  return (
    <>
      <BlogList fetchedBlogs={fetchedBlogs} currentUser={user} />
    </>
  );
}
