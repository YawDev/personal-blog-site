import { FormMode } from "@/utils/forms/FormHelpers";
import { Blog } from "@/types/types";
import { SavePostForm } from "@/components/blog/save/SavePostForm";
import { fetchPostById } from "@/utils/serverApi";
import { notFound, redirect, unauthorized } from "next/navigation";
import { getInitialUser } from "@/utils/authUtil";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let blogToEdit: Blog | null = await fetchPostById(id);
  if (!blogToEdit) {
    //If blog isnt found, redirect to not found
    notFound();
  }

  const user = await getInitialUser();
  const isLoggedIn = !!user;

  if(!isLoggedIn)
    redirect("/identity/login")

  if (isLoggedIn && blogToEdit.userId !== user?.id) {
      return unauthorized();
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
