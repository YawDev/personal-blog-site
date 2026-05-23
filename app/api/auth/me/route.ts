import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizeUser } from "@/utils/mapping/mappers";

export async function GET(request: Request) {
  try {
    const httpClient = createHttpClient();

    const cookieHeader = request.headers.get("cookie") ?? "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    if (!accessToken) {
      return NextResponse.json(
        { status: 401, data: null, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const response = await httpClient.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", response.data);

    console.log("bff call", response.data);
    console.log("Attempting to normalize user data...");
    console.log("Data structure:", JSON.stringify(response.data, null, 2));

    const normalizedUser = normalizeUser(response.data);
    console.log("Normalized user:", normalizedUser);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedUser,
        message: "User information retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("=== GET CURRENT USER API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Failed to retrieve user information",
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
            : "An error occurred while retrieving user information.",
      },
      { status: 500 },
    );
  }
}
