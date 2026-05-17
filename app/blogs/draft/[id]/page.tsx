import { FormMode } from "@/utils/forms/FormHelpers";
import { Blog } from "@/types/types";
import { SavePostForm } from "@/components/blog/save/SavePostForm";

const EditDraftPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let draftToEdit: Blog | null = null;
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <SavePostForm
      mode={FormMode.EditDraft}
      blogData={
        draftToEdit || {
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
};

export default EditDraftPage;
