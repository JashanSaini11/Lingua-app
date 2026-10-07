import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageCode } from "@/types/learning";

export default function LanguageScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  // Local for now. A Zustand store will keep the chosen language later.
  const [selected, setSelected] = useState<LanguageCode>("es");

  const query = search.trim().toLowerCase();
  const visibleLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(query) ||
      language.nativeName.toLowerCase().includes(query),
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            {/* Header */}
            <View className="mt-2 h-12 items-center justify-center">
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={goBack}
                className="absolute -left-1 h-11 w-10 justify-center"
              >
                <Image
                  source={images.chevronBack}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
              <Text className="font-poppins-medium text-h3 text-text-primary">
                Choose a language
              </Text>
            </View>

            {/* Search */}
            <View className="mt-4 h-[52px] flex-row items-center rounded-full border border-border bg-surface px-5">
              <Image
                source={images.search}
                style={{ width: 22, height: 22 }}
              />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search languages"
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
                autoCorrect={false}
                className="ml-3 flex-1 p-0 font-poppins text-body-lg text-text-primary"
                style={{ padding: 0 }}
              />
            </View>

            {/* List */}
            <Text className="mb-3 mt-6 font-poppins-medium text-h4 text-text-primary">
              Popular
            </Text>

            {visibleLanguages.map((language) => {
              const isSelected = language.code === selected;

              return (
                <TouchableOpacity
                  key={language.code}
                  activeOpacity={0.8}
                  onPress={() => setSelected(language.code)}
                  className={`language-card ${isSelected ? "language-card--selected" : ""}`}
                >
                  <Image
                    source={{ uri: language.flagUrl }}
                    contentFit="cover"
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                  <View className="ml-4 flex-1">
                    <Text className="font-poppins-medium text-h4 text-text-primary">
                      {language.name}
                    </Text>
                    <Text className="font-poppins text-body-sm text-text-secondary">
                      {language.learners}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View className="size-8 items-center justify-center rounded-full bg-lingua-deep-purple">
                      <Image
                        source={images.check}
                        style={{ width: 18, height: 18 }}
                      />
                    </View>
                  ) : (
                    <Image
                      source={images.chevronForward}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            {visibleLanguages.length === 0 && (
              <Text className="py-6 text-center font-poppins text-body-md text-text-secondary">
                No languages found
              </Text>
            )}

            {/* Confirm */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={goBack}
              className="mt-2 h-14 items-center justify-center rounded-[18px] bg-lingua-deep-purple"
            >
              <Text className="font-poppins-semibold text-h4 text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* The earth sits below the list, so it never covers the button.
            The picture has empty space around it: it is made a little wider
            than the screen and moved up so only the monuments and the top
            of the globe show, like the design. */}
        <View
          pointerEvents="none"
          className="overflow-hidden"
          style={{ height: width * 0.45 }}
        >
          <Image
            source={images.earth}
            contentFit="contain"
            style={{
              width: width * 1.1,
              height: width * 1.1,
              marginTop: -width * 0.187,
              alignSelf: "center",
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
