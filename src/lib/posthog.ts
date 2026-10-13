import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

const missingConfiguration = [
  !projectToken && "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN",
  !host && "EXPO_PUBLIC_POSTHOG_HOST",
].filter(Boolean) as string[];

// Warn instead of throwing: a throw here makes this whole module fail to load,
// which crashes the root layout with "Cannot read property 'posthog' of undefined".
if (__DEV__ && missingConfiguration.length > 0) {
  console.warn(
    `PostHog is disabled. Missing env variable(s): ${missingConfiguration.join(", ")}. Add them to .env and restart with "npx expo start -c".`,
  );
}

export const posthog =
  missingConfiguration.length === 0
    ? new PostHog(projectToken!, {
        host,
        logs: {
          serviceName: "lingua-mobile",
          environment: __DEV__ ? "development" : "production",
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined;

export const posthogLogger = posthog?.logger;
