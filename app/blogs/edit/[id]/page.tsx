import { FormMode } from "@/app/utils/FormHelpers";
import { AddOrEditPostForm } from "@/components/blog/AddOrEditPostForm";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //const blogToEdit = await fetchById(id);

  return <AddOrEditPostForm mode={FormMode.EditPublished} blogData={null} />;
}
