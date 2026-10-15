// Talks to our own Expo API routes (src/app/api). The Clerk session token is
// sent so the server knows which user is calling.
// Relative URLs work in development. For production builds, set the
// `origin` option of the expo-router plugin in app.json to your server URL.
export async function apiPost<T>(
  path: string,
  clerkToken: string | null,
  body?: object,
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkToken ?? ""}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
  return data;
}
