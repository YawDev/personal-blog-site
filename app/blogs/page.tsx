import BlogList from "@/components/blog/Blogs";
import { Blog } from "../utils/types";

export default async function BlogsPage() {
  let fetchedBlogs: Blog[] | null = null;
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <>
      <BlogList fetchedBlogs={[]} />
    </>
  );
}
