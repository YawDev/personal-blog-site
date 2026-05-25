import { normalizeDrafts, normalizePosts } from "@/utils/mapping/mappers";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";
import { UpstreamDraftsResponse } from "@/types/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing user id" },
        { status: 400 },
      );
    }
    const httpClient = createHttpClient();

    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.slice("access_token=".length);

    const response = await httpClient.get(`/drafts/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    const data: UpstreamDraftsResponse = response.data;

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", data);

    console.log("bff call", data);
    console.log("Attempting to normalize drafts data...");
    console.log("Data structure:", JSON.stringify(data, null, 2));

    const normalizedDrafts = normalizeDrafts(data);
    console.log("Normalized drafts:", normalizedDrafts);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedDrafts,
        message: "Drafts fetch successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== GET DRAFTS API ROUTE ERROR ===");
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
          message: errorData?.message ?? "Drafts fetch failed",
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
            : "An error occurred during fetching all drafts.",
      },
      { status: 500 },
    );
  }
}
