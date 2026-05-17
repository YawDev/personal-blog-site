import { cookies } from "next/headers";
import { createHttpClient } from "@/utils/httpClientUtil";
import { normalizeUser } from "@/utils/mapping/mappers";
import { User } from "@/types/types";

// Utility function to fetch the current user on the server side
// Authenticate user before rendering pages and provide user data to components via context
// Keeps user logged in across page refreshes and server-side renders
// Nav bar can use this to conditionally render links based on authentication status
export async function getInitialUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) return null;

    const httpClient = createHttpClient();
    const response = await httpClient.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return normalizeUser(response.data);
  } catch {
    return null;
  }
}
