import BlogList from "@/components/blog/Blogs";
import { Blog } from "../../types/types";
import { GetAllPosts } from "@/service/PersonalBlogService";

export default async function BlogsPage() {
  let fetchedBlogs: Blog[] = await GetAllPosts();

  return (
    <>
      <BlogList fetchedBlogs={fetchedBlogs} />
    </>
  );
}
