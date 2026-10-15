// Server only. The API secret lives here and never reaches the mobile app.
import { StreamClient } from "@stream-io/node-sdk";

export function getStreamServerClient(): StreamClient {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("Missing STREAM_API_KEY or STREAM_API_SECRET in .env");
  }
  return new StreamClient(apiKey, apiSecret);
}
