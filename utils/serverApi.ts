import { Blog, Draft } from "@/types/types";
import axios from "axios";
import { cookies } from "next/headers";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizePost, normalizePosts, normalizeDraft, normalizeDrafts } from "@/utils/mapping/mappers";

function logUpstreamError(label: string, error: unknown) {
  console.error(`=== ${label} ===`);
  if (axios.isAxiosError(error)) {
    console.error("Backend response status:", error.response?.status);
    console.error("Backend response data:", error.response?.data);
    console.error("Message:", error.message);
  } else {
    console.error("Error details:", error);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function fetchAllPosts(): Promise<Blog[]> {
  try {
    const response = await createHttpClient().get("/blogs");
    return normalizePosts(response.data);
  } catch (error) {
    logUpstreamError("SERVER fetchAllPosts ERROR", error);
    return [];
  }
}

export async function fetchPostById(id: string): Promise<Blog | null> {
  try {
    const response = await createHttpClient().get(`/blogs/${id}`);
    return normalizePost(response.data);
  } catch (error) {
    logUpstreamError("SERVER fetchPostById ERROR", error);
    return null;
  }
}

export async function fetchAllDraftsByUser(userId: string): Promise<Draft[]> {
  try {
    const response = await createHttpClient().get(`/drafts/users/${userId}`, {
      headers: await getAuthHeaders(),
    });
    return normalizeDrafts(response.data);
  } catch (error) {
    logUpstreamError("SERVER fetchAllDraftsByUser ERROR", error);
    return [];
  }
}

export async function fetchDraftById(draftId: string, userId: string): Promise<Draft | null> {
  try {
    const response = await createHttpClient().get(`/drafts/${draftId}/users/${userId}`, {
      headers: await getAuthHeaders(),
    });
    return normalizeDraft(response.data);
  } catch (error) {
    logUpstreamError("SERVER fetchDraftById ERROR", error);
    return null;
  }
}

export async function DeletePost(
  postId: string,
  userId: string | null,
): Promise<boolean> {
  try {
    const response = await createHttpClient().delete(
      `/blogs/${postId}/users/${userId}/delete`,
      { headers: await getAuthHeaders() },
    );
    console.log("Blog deleted successfully");
    return response.data.isDeleted === true;
  } catch (error) {
    logUpstreamError("SERVER DeletePost ERROR", error);
    return false;
  }
}
