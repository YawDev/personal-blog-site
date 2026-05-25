import { DeleteDraftRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function DELETE(request: Request) {
  try {
    const body: DeleteDraftRequest = await request.json();

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

    const response = await httpClient.delete(
      `/drafts/${body.draftId}/users/${body.userId}/delete`,
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
        message: "Draft deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return NextResponse.json(
        { status, data: null, message: "Not able to delete draft." },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
