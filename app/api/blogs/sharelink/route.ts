import { EmailShareLinkRequest } from "@/types/types";
import { createHttpClient } from "@/utils/httpClientUtil";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: EmailShareLinkRequest = await request.json();
    const httpClient = createHttpClient();

    const response = await httpClient.post(
      `/blogs/sharelink/send-email`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.isTriggered) {
      return NextResponse.json(
        {
          status: 200,
          data: response.data,
          message: "Post successfully shared!",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          status: 400,
          data: response.data,
          message: "Sorry, could not send emailed share link!",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("=== EMAIL SHARELINK API ROUTE ERROR ===");
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data || {};
      return NextResponse.json(
        { status: status, data: null, message: "Not able to send email." },
        { status: status },
      );
    }
    return NextResponse.json(
      { status: 500, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}
