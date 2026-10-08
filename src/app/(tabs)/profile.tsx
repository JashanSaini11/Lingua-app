import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View } from "react-native";

import { useLanguageStore } from "@/store/useLanguageStore";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  // Testing only: forget the saved language. The tabs layout then sends us
  // back to the language screen because `selectedLanguage` is empty again.
  const clearStorage = async () => {
    // Reset the store first, then wipe AsyncStorage so the empty value
    // the store just saved is removed as well.
    useLanguageStore.setState({ selectedLanguage: null });
    await AsyncStorage.clear();
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="typography--h2 text-text-primary">Profile</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={clearStorage}
        className="mt-8 h-14 items-center justify-center rounded-2xl border border-lingua-deep-purple px-8"
      >
        <Text className="font-poppins-semibold text-h4 text-lingua-deep-purple">
          Clear storage (test)
        </Text>
      </TouchableOpacity>

      {/* Signing out sends the user back to onboarding. */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => signOut()}
        className="mt-4 h-14 items-center justify-center rounded-2xl bg-lingua-deep-purple px-8"
      >
        <Text className="font-poppins-semibold text-h4 text-white">
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
