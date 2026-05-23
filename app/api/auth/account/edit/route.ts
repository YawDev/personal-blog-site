import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: 400, data: null, message: "Missing user id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const httpClient = createHttpClient();

    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.slice("access_token=".length);

    const response = await httpClient.put(`/api/account/edit/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", response.data);

    if (response.status !== 200 && response.status !== 201) {
      return NextResponse.json(
        {
          status: response.status,
          data: null,
          message: response.data?.message ?? "Account edit failed",
        },
        { status: response.status },
      );
    }
    return NextResponse.json(
      {
        status: 200,
        data: null,
        message: "Account edited successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== EDIT ACCOUNT API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message:
            errorData?.Message ?? errorData?.message ?? "Account edit failed",
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
            : "An error occurred during registration.",
      },
      { status: 500 },
    );
  }
}
