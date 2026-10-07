import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { authErrors, PASSWORD_MIN_LENGTH } from "@/constants/errors";

export type AuthMode = "sign-up" | "sign-in";
export type SocialStrategy = "oauth_google" | "oauth_apple";

type ClerkResult = {
  error: { code: string; longMessage?: string; message: string } | null;
};

// Every Clerk call resolves to `{ error }`, so we only need one place to show it.
// Known error codes use our own message, anything else shows Clerk's message.
function showError(error: NonNullable<ClerkResult["error"]>) {
  Alert.alert(
    authErrors.title,
    authErrors.clerk[error.code] ?? error.longMessage ?? error.message,
  );
}

// Returns the first problem with the form, or null when it is fine.
function validateForm(mode: AuthMode, email: string, password: string) {
  if (!email) return authErrors.emailRequired;
  if (!/^\S+@\S+\.\S+$/.test(email)) return authErrors.emailInvalid;

  if (mode === "sign-up") {
    if (!password) return authErrors.passwordRequired;
    if (password.length < PASSWORD_MIN_LENGTH) return authErrors.passwordTooShort;
  }
  return null;
}

// Clerk logic for the sign up and sign in screens.
//   sign-up: email + password -> email code -> account created
//   sign-in: email -> email code -> signed in
export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  // Makes the new session active, then opens the home route.
  // Pass the whole sign in / sign up object (not `signUp.finalize` alone):
  // its methods need `this`, which is lost when a method is passed around by itself.
  const finishAuth = async (attempt: typeof signIn | typeof signUp) => {
    const { error } = await attempt.finalize({
      navigate: () => router.replace("/"),
    });
    if (error) {
      showError(error);
    }
  };

  // Step 1: send the verification code. Returns true when the code modal should open.
  const start = async (email: string, password: string) => {
    const problem = validateForm(mode, email, password);
    if (problem) {
      Alert.alert(authErrors.title, problem);
      return false;
    }

    setLoading(true);
    try {
      if (mode === "sign-up") {
        const created = await signUp.password({ emailAddress: email, password });
        if (created.error) {
          showError(created.error);
          return false;
        }

        const sent = await signUp.verifications.sendEmailCode();
        if (sent.error) {
          showError(sent.error);
          return false;
        }
        return true;
      }

      const sent = await signIn.emailCode.sendCode({ emailAddress: email });
      if (sent.error) {
        showError(sent.error);
        return false;
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: check the 6-digit code. Returns true when the user is signed in.
  const verify = async (code: string) => {
    if (mode === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        showError(error);
        return false;
      }

      if (signUp.status !== "complete") {
        // Happens when the Clerk Dashboard asks for more fields than this screen has.
        Alert.alert(
          authErrors.incompleteTitle,
          authErrors.missingFields(signUp.missingFields),
        );
        return false;
      }

      await finishAuth(signUp);
      return true;
    }

    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      showError(error);
      return false;
    }

    if (signIn.status !== "complete") {
      Alert.alert(
        authErrors.signInIncompleteTitle,
        authErrors.unfinishedSignIn(signIn.status),
      );
      return false;
    }

    await finishAuth(signIn);
    return true;
  };

  // Google / Apple. Clerk opens the provider in a browser sheet.
  // The same call signs in existing users and creates new ones.
  const signInWithSocial = async (strategy: SocialStrategy) => {
    setLoading(true);
    try {
      const { createdSessionId, setActive, signUp: pendingSignUp } =
        await startSSOFlow({ strategy });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      } else if (pendingSignUp?.status === "missing_requirements") {
        Alert.alert(
          authErrors.incompleteTitle,
          authErrors.missingFields(pendingSignUp.missingFields),
        );
      }
      // No session and nothing missing means the user closed the browser.
    } catch (error) {
      Alert.alert(
        authErrors.title,
        error instanceof Error ? error.message : authErrors.generic,
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, start, verify, signInWithSocial };
}
