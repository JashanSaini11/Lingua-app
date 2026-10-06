import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="typography--h1 text-lingua-purple">lingua</Text>
      <Text className="typography--body-md mt-2 text-text-secondary">
        Welcome to Lingua!
      </Text>

      <Link href="/onboarding" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-8 h-14 items-center justify-center rounded-2xl bg-lingua-deep-purple px-8"
        >
          <Text className="font-poppins-semibold text-h4 text-white">
            View onboarding
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
