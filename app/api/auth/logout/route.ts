import { NextResponse } from "next/server";
import axios from "axios";
import { createHttpClient } from "@/utils/httpClientUtil";

export async function POST(request: Request) {
  try {
    const httpClient = createHttpClient();

    const cookieHeader = request.headers.get("cookie") ?? "";
    const response = await httpClient.post("/api/auth/logout", null, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", response.data);

    const res = NextResponse.json(
      {
        status: 200,
        data: null,
        message: "Logout successful",
      },
      { status: 200 },
    );

    // Forward the cookie deletions from the .NET backend
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookies.forEach((cookie) =>
        res.headers.append("Set-Cookie", cookie),
      );
    }

    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");

    return res;
  } catch (error) {
    console.error("=== LOGOUT API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Logout failed",
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
            : "An error occurred during logout.",
      },
      { status: 500 },
    );
  }
}
