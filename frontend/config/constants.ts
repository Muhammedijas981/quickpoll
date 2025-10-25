export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1/ws";


console.log("🔍 API_URL:", API_URL);
console.log("🔍 WS_URL:", WS_URL);