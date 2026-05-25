import { normalizeDraft } from "@/utils/mapping/mappers";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";
import { UpstreamDraftByIdResponse } from "@/types/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const draftId = searchParams.get("draftId");

    if (!userId) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing user id" },
        { status: 400 },
      );
    }

    if (!draftId) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing draft id" },
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

    const response = await httpClient.get(
      `/drafts/${draftId}/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    const data: UpstreamDraftByIdResponse = response.data;
    const normalizedDraft = normalizeDraft(data);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedDraft,
        message: "Draft fetch successful",
      },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Draft fetch failed",
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
            : "An error occurred during fetching draft.",
      },
      { status: 500 },
    );
  }
}
