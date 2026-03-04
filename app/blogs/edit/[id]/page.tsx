import { FormMode } from "@/utils/FormHelpers";
import { Blog } from "@/utils/types";
import { SavePostForm } from "@/components/blog/save/SavePostForm";

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
    <SavePostForm
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
