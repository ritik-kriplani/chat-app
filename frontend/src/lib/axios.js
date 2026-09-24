import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "");
rawBaseUrl = rawBaseUrl.replace(/\/+$/, "");
if (rawBaseUrl.endsWith("/api")) {
  rawBaseUrl = rawBaseUrl.slice(0, -4);
}

export const axiosInstance = axios.create({
  baseURL: rawBaseUrl ? `${rawBaseUrl}/api` : "/api",
  withCredentials: true,
});

