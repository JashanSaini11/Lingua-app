import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { getLanguageByCode } from "@/data/languages";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function Index() {
  const { signOut } = useAuth();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

  const language = selectedLanguage
    ? getLanguageByCode(selectedLanguage)
    : undefined;

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
      <Text className="typography--h1 text-lingua-purple">lingua</Text>
      <Text className="typography--body-md mt-2 text-text-secondary">
        Welcome to Lingua!
      </Text>

      {language && (
        <View className="mt-6 flex-row items-center">
          <Image
            source={{ uri: language.flagUrl }}
            contentFit="cover"
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <View className="ml-4">
            <Text className="font-poppins text-body-sm text-text-secondary">
              You are learning
            </Text>
            <Text className="font-poppins-medium text-h4 text-text-primary">
              {language.name} {language.greeting}
            </Text>
          </View>
        </View>
      )}

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

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={clearStorage}
        className="mt-4 h-14 items-center justify-center rounded-2xl border border-lingua-deep-purple px-8"
      >
        <Text className="font-poppins-semibold text-h4 text-lingua-deep-purple">
          Clear storage (test)
        </Text>
      </TouchableOpacity>

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
