import axios from "axios";
import https from "https";

export const createHttpClient = () => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) throw new Error("BACKEND_URL is not set — add it to .env.local");

  const devHttpsAgent =
    process.env.NODE_ENV !== "production"
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

  return axios.create({
    httpsAgent: devHttpsAgent,
    timeout: 5000,
    withCredentials: true,
    baseURL: backendUrl,
  });
};
