import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const httpClient = createHttpClient();

    const response = await httpClient.post("/api/account/edit", body, {
      headers: { "Content-Type": "application/json" },
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
