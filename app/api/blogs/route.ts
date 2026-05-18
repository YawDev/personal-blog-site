import { normalizePosts } from "@/utils/mapping/mappers";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";
import { UpstreamBlogsResponse } from "@/types/types";

export async function GET(request: Request) {
  try {
    const httpClient = createHttpClient();

    const response = await httpClient.get("/blogs");

    const data: UpstreamBlogsResponse = response.data;

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", data);

    console.log("bff call", data);
    console.log("Attempting to normalize posts data...");
    console.log("Data structure:", JSON.stringify(data, null, 2));

    const normalizedPosts = normalizePosts(data);
    console.log("Normalized posts:", normalizedPosts);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedPosts,
        message: "Posts fetch successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== GET POSTS API ROUTE ERROR ===");
    console.error("Error details:", error);

    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      console.error("Backend response status:", status);
      console.error("Backend response data:", errorData);

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Posts fetch failed",
        },
        { status },
      );
    }

    // Handle other errors
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        status: 500,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during fetching all posts.",
      },
      { status: 500 },
    );
  }
}
