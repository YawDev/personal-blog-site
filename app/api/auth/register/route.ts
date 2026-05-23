import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const httpClient = createHttpClient();

    const response = await httpClient.post("/api/auth/register", body, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", response.data);

    if (response.status !== 200 && response.status !== 201) {
      return NextResponse.json(
        {
          status: response.status,
          data: null,
          message: response.data?.message ?? "Registration failed",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: null,
        message: "Account registered successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== REGISTER API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message:
            errorData?.Message ?? errorData?.message ?? "Registration failed",
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
