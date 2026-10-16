import "../global.css";

import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  usePathname,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect, useRef } from "react";
import { useColorScheme } from "react-native";

import { StreamVideoProvider } from "@/components/StreamVideoProvider";
import { fontAssets } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useSettingsStore } from "@/store/useSettingsStore";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function PostHogUserIdentity() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const posthogClient = usePostHog();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const identifiedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      identifiedKey.current = null;
      return;
    }
    // Wait for the saved language, so preferred_language is not sent as null by mistake.
    if (!user || !hasHydrated) {
      return;
    }

    const key = `${user.id}:${selectedLanguage}`;
    if (identifiedKey.current === key) {
      return;
    }

    posthogClient.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.firstName ? { first_name: user.firstName } : {}),
        ...(user.lastName ? { last_name: user.lastName } : {}),
        preferred_language: selectedLanguage,
      },
      $set_once: { signup_date: new Date().toISOString() },
    });
    identifiedKey.current = key;
  }, [hasHydrated, isLoaded, isSignedIn, posthogClient, selectedLanguage, user]);

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
  // The saved theme is applied while loading, so the first screen has the right colors.
  const hasLoadedTheme = useSettingsStore((state) => state.hasHydrated);

  const ready =
    (fontsLoaded || fontError) && isLoaded && hasHydrated && hasLoadedTheme;

  // Screens and the system navigation bar use the app's own background, so
  // nothing white shows behind a dark screen (or the other way round).
  const scheme = useColorScheme();
  const theme = useThemeColors();
  const baseTheme = scheme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: theme.background,
      card: theme.card,
      border: theme.border,
      text: theme.textPrimary,
    },
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <StreamVideoProvider>
        {/* Dark icons on the light theme, light icons on the dark theme */}
        <StatusBar style="auto" />
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
    </ThemeProvider>
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
