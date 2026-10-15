// Server only. Used by API routes (`+api.ts`) to find out who is calling.
// It checks the Clerk session token the app sends, so the server never trusts
// a user id that comes from the request body or query.

type Jwk = JsonWebKey & { kid: string };

// Clerk's frontend API host is hidden inside the publishable key:
// pk_test_<base64 of "your-app.clerk.accounts.dev$">
function getClerkIssuer(): string {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }
  const host = atob(key.split("_")[2]).replace(/\$$/, "");
  return `https://${host}`;
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function decodeJson<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

// Clerk's public keys rarely change, so we keep them in memory.
let cachedKeys: Jwk[] | null = null;

async function getPublicKeys(forceRefresh = false): Promise<Jwk[]> {
  if (cachedKeys && !forceRefresh) {
    return cachedKeys;
  }
  const response = await fetch(`${getClerkIssuer()}/.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error("Could not load Clerk public keys");
  }
  const body = (await response.json()) as { keys: Jwk[] };
  cachedKeys = body.keys;
  return cachedKeys;
}

// Returns the Clerk user id (the `sub` claim) or null when the token is bad.
export async function getClerkUserId(request: Request): Promise<string | null> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return null;
  }

  try {
    const [header, payload, signature] = token.split(".");
    const { kid, alg } = decodeJson<{ kid: string; alg: string }>(header);
    if (alg !== "RS256") {
      return null;
    }

    let keys = await getPublicKeys();
    let jwk = keys.find((key) => key.kid === kid);
    if (!jwk) {
      // Clerk may have rotated its keys since we cached them.
      keys = await getPublicKeys(true);
      jwk = keys.find((key) => key.kid === kid);
    }
    if (!jwk) {
      return null;
    }

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const isValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      decodeBase64Url(signature),
      new TextEncoder().encode(`${header}.${payload}`),
    );
    if (!isValid) {
      return null;
    }

    const claims = decodeJson<{
      sub: string;
      iss: string;
      exp: number;
      nbf?: number;
    }>(payload);
    const now = Math.floor(Date.now() / 1000);
    if (claims.iss !== getClerkIssuer() || claims.exp < now) {
      return null;
    }
    if (claims.nbf && claims.nbf > now) {
      return null;
    }

    return claims.sub;
  } catch {
    return null;
  }
}
