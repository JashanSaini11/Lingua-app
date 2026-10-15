import { useAuth, useUser } from "@clerk/expo";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useEffect, useState, type ReactNode } from "react";

import { fetchStreamToken, getStreamUserInfo, streamApiKey } from "@/lib/stream";

// Connects the signed-in Clerk user to Stream once and shares the client with
// every screen. Signed-out users never get a Stream client.
export function StreamVideoProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [client, setClient] = useState<StreamVideoClient>();

  const userId = user?.id;

  useEffect(() => {
    if (!isSignedIn || !user) {
      return;
    }

    const streamClient = StreamVideoClient.getOrCreateInstance({
      apiKey: streamApiKey,
      user: getStreamUserInfo(user),
      // Asks our API route for a fresh token. The SDK calls this again by
      // itself when the token is about to expire.
      tokenProvider: async () => fetchStreamToken(await getToken()),
    });
    // The client lives outside React, so we keep it in sync from an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClient(streamClient);

    return () => {
      streamClient.disconnectUser().catch((error) => console.error(error));
      setClient(undefined);
    };
    // Only reconnect when the signed-in user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId]);

  if (!isSignedIn) {
    return children;
  }
  // Wait one render for the client so the screens below never remount.
  if (!client) {
    return null;
  }
  return <StreamVideo client={client}>{children}</StreamVideo>;
}
