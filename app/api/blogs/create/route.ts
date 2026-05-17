import { SavePostRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: SavePostRequest = await request.json();
    const httpClient = createHttpClient();
    const response = await httpClient.post(
      `/blogs/create/${body.userId}`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return NextResponse.json(
      {
        status: 200,
        data: response.data,
        message: "Blog created successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== CREATE BLOG API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status: status, data: null, message: "Not able to create blog." },
        { status: status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
