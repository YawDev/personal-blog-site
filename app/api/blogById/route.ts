import { normalizePost } from "@/utils/mapping/mappers";
import { UpstreamBlogByIdResponse } from "@/types/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing blog id" },
        { status: 400 },
      );
    }

    const httpClient = createHttpClient();
    const response = await httpClient.get(`/blogs/${id}`);

    const data: UpstreamBlogByIdResponse = response.data;

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", data);

    const normalizedPost = normalizePost(data);
    console.log("Normalized post:", normalizedPost);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedPost,
        message: "Post fetch successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== GET POST BY ID API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Post fetch failed",
        },
        { status },
      );
    }

    return NextResponse.json(
      {
        status: 500,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during fetching post.",
      },
      { status: 500 },
    );
  }
}
