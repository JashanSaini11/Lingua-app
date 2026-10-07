import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { type AuthMode, useAuthFlow } from "@/hooks/useAuthFlow";

// Only the copy changes between the two screens.
const copy = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Start your language journey today",
    button: "Sign Up",
    footerText: "Already have an account?",
    footerLink: "Log in",
    footerHref: "/sign-in",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Continue your language journey",
    button: "Sign In",
    footerText: "New to Lingua?",
    footerLink: "Sign up",
    footerHref: "/sign-up",
  },
} as const;

const socialProviders = [
  { name: "Google", icon: images.google, strategy: "oauth_google" },
  { name: "Apple", icon: images.apple, strategy: "oauth_apple" },
] as const;


const MASCOT_WIDTH_RATIO = 0.55; // picture size / screen width
const MASCOT_OFFSET_RATIO = 0.135; // how far the picture is pulled up
const MASCOT_VISIBLE_RATIO = 0.612; // how much of the picture height is shown

const inputCardClass =
  "h-[78px] rounded-[20px] border border-border bg-white px-[18px] pt-[14px]";
// Poppins is a tall font: the input needs enough height or the text is cut off.
const inputClass = "mt-0.5 h-[34px] p-0 font-poppins-medium text-[16px]";

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const text = copy[mode];
  const { loading, start, verify, signInWithSocial } = useAuthFlow(mode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const mascotSize = width * MASCOT_WIDTH_RATIO;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  };

  // Sends the code, then opens the code modal.
  const handleSubmit = async () => {
    if (await start(email.trim(), password)) {
      setVerifying(true);
    }
  };

  // On success the home route opens, so the modal only needs to stay for errors.
  const handleCode = async (code: string) => {
    await verify(code);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pb-6">
            {/* Back button */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goBack}
              className="-ml-1 mt-2 h-11 w-10 justify-center"
            >
              <Image
                source={images.chevronBack}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>

            {/* Heading */}
            <Text className="mt-3.5 font-poppins-bold text-[26px] leading-[34px] text-text-primary">
              {text.title}
            </Text>
            <View className="mt-2.5 flex-row items-center">
              <Text className="font-poppins text-body-md text-text-secondary">
                {text.subtitle}
              </Text>
              <Image
                source={images.sparkles}
                style={{ width: 20, height: 20, marginLeft: 6 }}
              />
            </View>

            {/* Mascot peeking over the first input */}
            <View
              className="mt-3 overflow-hidden"
              style={{ height: mascotSize * MASCOT_VISIBLE_RATIO }}
            >
              <Image
                source={images.mascotAuth}
                contentFit="contain"
                style={{
                  width: mascotSize,
                  height: mascotSize,
                  alignSelf: "center",
                  marginTop: -mascotSize * MASCOT_OFFSET_RATIO,
                  marginLeft: -mascotSize * 0.075,
                  // The design shows the fox waving with its left hand.
                  transform: [{ scaleX: -1 }],
                }}
              />
              <Image
                source={images.sparkle}
                tintColor="#F5A623"
                style={{ position: "absolute", left: "21%", top: "21%", width: 15, height: 15 }}
              />
              <Image
                source={images.sparkle}
                tintColor="#4D8BFF"
                style={{ position: "absolute", left: "77%", top: "27%", width: 13, height: 13 }}
              />
              <Image
                source={images.sparkle}
                tintColor="#FFD54A"
                style={{ position: "absolute", left: "74%", top: "51%", width: 15, height: 15 }}
              />
            </View>

            {/* Email */}
            <View className={inputCardClass}>
              <Text className="font-poppins text-body-sm leading-5 text-text-secondary">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex@gmail.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                className={`${inputClass} text-text-primary`}
                style={{ padding: 0, textAlignVertical: "center" }}
              />
            </View>

            {/* Password (sign up only) */}
            {mode === "sign-up" && (
              <View className={`mt-3.5 ${inputCardClass}`}>
                <Text className="font-poppins text-body-sm leading-5 text-text-secondary">
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  className={`${inputClass} mr-10 text-text-primary`}
                  style={{ padding: 0, textAlignVertical: "center" }}
                />
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={12}
                  className="absolute right-4 top-[28px]"
                >
                  <Image
                    source={showPassword ? images.eyeOff : images.eye}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Main button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={loading}
              className="mt-5 h-[60px] items-center justify-center rounded-[18px] bg-lingua-deep-purple"
            >
              <Text className="font-poppins-semibold text-[18px] text-white">
                {text.button}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="mt-[26px] flex-row items-center">
              <View className="h-px flex-1 bg-border" />
              <Text className="mx-[18px] font-poppins text-body-md text-text-secondary">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            {/* Social buttons */}
            <View className="mt-4 gap-2.5">
              {socialProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.name}
                  activeOpacity={0.7}
                  onPress={() => signInWithSocial(provider.strategy)}
                  disabled={loading}
                  className="h-14 flex-row items-center rounded-[18px] border border-border bg-white pl-[39px]"
                >
                  <Image
                    source={provider.icon}
                    style={{ width: 26, height: 26 }}
                  />
                  <Text className="ml-8 font-poppins-medium text-[15px] text-text-primary">
                    {`Continue with ${provider.name}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer link to the other screen */}
            <View className="mt-auto flex-row justify-center pt-8">
              <Text className="font-poppins text-body-md text-text-secondary">
                {`${text.footerText} `}
              </Text>
              <Link href={text.footerHref} replace asChild>
                <Text className="font-poppins-semibold text-body-md text-lingua-deep-purple">
                  {text.footerLink}
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {verifying && (
        <VerificationModal
          email={email}
          onClose={() => setVerifying(false)}
          onSubmit={handleCode}
        />
      )}

      {/* Clerk needs this on web to show its bot check. It is invisible on mobile. */}
      {mode === "sign-up" && <View nativeID="clerk-captcha" />}
    </SafeAreaView>
  );
}
