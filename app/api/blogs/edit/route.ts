import { SavePostRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body: SavePostRequest & { postId: string } = await request.json();
    const httpClient = createHttpClient();

    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.slice("access_token=".length);

    const response = await httpClient.put(
      `/blogs/${body.postId}/users/${body.userId}`,
      { title: body.title, content: body.content, preview: body.preview },
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    return NextResponse.json(
      { status: 200, data: response.data, message: "Blog updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return NextResponse.json(
        { status, data: null, message: "Not able to update blog." },
        { status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
