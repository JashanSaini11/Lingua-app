import { useAuth } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="typography--h1 text-lingua-purple">lingua</Text>
      <Text className="typography--body-md mt-2 text-text-secondary">
        Welcome to Lingua!
      </Text>

      <Link href="/language" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-8 h-14 items-center justify-center rounded-2xl border border-lingua-deep-purple px-8"
        >
          <Text className="font-poppins-semibold text-h4 text-lingua-deep-purple">
            Choose a language
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Signing out sends the user back to onboarding. */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => signOut()}
        className="mt-8 h-14 items-center justify-center rounded-2xl bg-lingua-deep-purple px-8"
      >
        <Text className="font-poppins-semibold text-h4 text-white">
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
