import { FormMode } from "@/utils/forms/FormHelpers";
import { Blog } from "@/types/types";
import { SavePostForm } from "@/components/blog/save/SavePostForm";
import { fetchPostById } from "@/utils/serverApi";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let blogToEdit: Blog | null = await fetchPostById(id);
  if (!blogToEdit) {
    //If blog isnt found, redirect to not found
  }
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
          userId: "",
        }
      }
    />
  );
}
