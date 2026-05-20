import BlogList from "@/components/blog/Blogs";
import { fetchAllPosts } from "@/utils/serverApi";
import { getInitialUser } from "@/utils/authUtil";

export default async function BlogsPage() {
  const [fetchedBlogs, user] = await Promise.all([
    fetchAllPosts(),
    getInitialUser(),
  ]);

  return (
    <>
      <BlogList fetchedBlogs={fetchedBlogs} currentUser={user} />
    </>
  );
}
