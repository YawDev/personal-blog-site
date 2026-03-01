import { FormMode } from "@/app/utils/FormHelpers";
import { Blog } from "@/app/utils/types";
import { AddOrEditPostForm } from "@/components/blog/saveBlogPost/AddOrEditPostForm";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //const blogToEdit = await fetchById(id);

  let blogToEdit: Blog | null = null;
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <AddOrEditPostForm
      mode={FormMode.EditPublished}
      blogData={
        blogToEdit || {
          id: id, // Pass ID to client to fetch actual blog details from localStorage until we integrate the API
          title: "",
          preview: "",
          content: "",
          datePosted: new Date().toISOString(),
        }
      }
    />
  );
}
