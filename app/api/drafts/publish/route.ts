import { SaveDraftRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId) {
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

    const response = await httpClient.post(
      `/drafts/${body.draftId}/users/${body.userId}/publish`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    return NextResponse.json(
      {
        status: 200,
        data: response.data,
        message: "Draft published successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== PUBLISH DRAFT API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status: status, data: null, message: "Not able to publish draft." },
        { status: status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
