import { normalizeUser } from "@/utils/mapping/mappers";
import { UpstreamLoginResponse } from "@/types/types";
import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const httpClient = createHttpClient();

    const response = await httpClient.post("/api/auth/login", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: UpstreamLoginResponse = response.data;

    console.log("Request body:", body);
    console.log("Backend response status:", response.status);
    console.log("Backend response data:", data);

    console.log("bff call", data);
    console.log("Attempting to normalize user data...");
    console.log("Data structure:", JSON.stringify(data, null, 2));

    const normalizedUser = normalizeUser(data);
    console.log("Normalized user:", normalizedUser);

    const nextResponse = NextResponse.json(
      {
        status: 200,
        data: normalizedUser,
        message: "Login successful",
      },
      { status: 200 },
    );

    // Forward the access_token cookie the .NET backend set
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach((cookie) =>
        nextResponse.headers.append("Set-Cookie", cookie),
      );
    }

    return nextResponse;
  } catch (error) {
    console.error("=== LOGIN API ROUTE ERROR ===");
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
          message: errorData?.message ?? "Login failed",
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
            : "An error occurred during login.",
      },
      { status: 500 },
    );
  }
}
