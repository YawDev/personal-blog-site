import axios from "axios";
import { FormMode } from "@/utils/forms/FormHelpers";
import { Blog, Draft } from "@/types/types";
import { SavePostForm } from "@/components/blog/save/SavePostForm";
import { redirect, unauthorized } from "next/dist/client/components/navigation";
import { getInitialUser } from "@/utils/authUtil";
import { cookies } from "next/headers";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizeDraft } from "@/utils/mapping/mappers";
import { notFound } from "next/navigation";

const EditDraftPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const user = await getInitialUser();
  if (!user) {
    redirect("/identity/login");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let data: Draft | null = null;
  if (accessToken) {
    try {
      const httpClient = createHttpClient();
      const response = await httpClient.get(`/drafts/${id}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      data = normalizeDraft(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return unauthorized();
      }
      return notFound();
    }
  }
  
  if(!data){
    return notFound();
  }

  let draftToEdit: Blog | null = {
    id: id, // Pass ID to client to fetch actual blog details from localStorage until we integrate the API
    title: data?.title || "",
    preview: data?.preview || "",
    content: data?.content || "",
    datePosted: data?.createdOn || new Date().toISOString(),
    userId: data?.userId || "",
  };

  return <SavePostForm mode={FormMode.EditDraft} blogData={draftToEdit} />;
};

export default EditDraftPage;
