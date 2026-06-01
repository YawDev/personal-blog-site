import { UpstreamRefreshUserSessionResponse } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizeUser } from "@/utils/mapping/mappers";
import axios from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

// This is a placeholder implementation for the token refresh endpoint.
const POST = async (request: Request) => {
  try {

    const cookieHeader = request.headers.get("cookie") ?? "";

    const httpClient = createHttpClient();
    const response = await httpClient.post("/api/auth/refresh", null, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // Forward cookies to the backend
      },
    });

    const data: UpstreamRefreshUserSessionResponse = response.data;
    const normalizedUser = normalizeUser(data);

    return NextResponse.json(
      {
        status: 200,
        data: normalizedUser,
        message: "Token refresh successful",
      },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { status: 401, data: null, message: "Session expired" },
          { status: 401 },
        );
      }

      const status = error.response?.status || 500;
      const errorData = error.response?.data || {};

      return NextResponse.json(
        {
          status,
          data: null,
          message: errorData?.message ?? "Token refresh failed",
        },
        { status },
      );
    }

    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
};

export { POST };