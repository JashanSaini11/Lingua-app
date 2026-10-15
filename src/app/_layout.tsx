import "../global.css";

import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

import { StreamVideoProvider } from "@/components/StreamVideoProvider";
import { fontAssets } from "@/constants/theme";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/useLanguageStore";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function PostHogUserIdentity() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const posthogClient = usePostHog();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      identifiedUserId.current = null;
      return;
    }
    if (!user || identifiedUserId.current === user.id) {
      return;
    }

    posthogClient.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.firstName ? { first_name: user.firstName } : {}),
        ...(user.lastName ? { last_name: user.lastName } : {}),
      },
    });
    identifiedUserId.current = user.id;
  }, [isLoaded, isSignedIn, posthogClient, user]);

  return null;
}

function PostHogScreenTracking() {
  const pathname = usePathname();
  const posthogClient = usePostHog();

  useEffect(() => {
    posthogClient.screen(pathname);
  }, [pathname, posthogClient]);

  return null;
}

function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // isLoaded turns true once Clerk has restored the saved session.
  const { isLoaded, isSignedIn } = useAuth();
  // The saved language is read from AsyncStorage, so we wait for it too.
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  const ready = (fontsLoaded || fontError) && isLoaded && hasHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  // Signed out users only see onboarding and the auth screens,
  // signed in users only see the app. Expo Router redirects automatically
  // when `isSignedIn` changes. StreamVideoProvider gives signed in users
  // a Stream client for the audio lessons.
  return (
    <StreamVideoProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)/sign-in" />
          <Stack.Screen name="(auth)/sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="language" />
          <Stack.Screen name="lesson/[id]" />
        </Stack.Protected>
      </Stack>
    </StreamVideoProvider>
  );
}

export default function RootLayout() {
  const content = <RootNavigator />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogUserIdentity />
          <PostHogScreenTracking />
          {content}
        </PostHogProvider>
      ) : (
        content
      )}
    </ClerkProvider>
  );
}
