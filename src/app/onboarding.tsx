import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpeechBubble } from "@/components/SpeechBubble";
import { images } from "@/constants/images";

export default function Onboarding() {
  const router = useRouter();
  // Size of the area reserved for the mascot (measured on layout).
  const [stage, setStage] = useState({ width: 0, height: 0 });

  // The mascot image is a square with transparent margins. Make it as big as
  // the design shows (about 128% of the stage width), but never taller than
  // the stage so it cannot overlap the text above or the button below.
  const mascotSize = Math.min(stage.width * 1.35, stage.height * 1.10);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 px-6 pb-6 pt-3">
        {/* Logo */}
        <View className="flex-row items-center justify-center">
          <Image
            source={images.mascotLogo}
            className="size-[80px]"
            resizeMode="contain"
          />
          <Text className="font-poppins-semibold text-[30px] text-text-primary">
            lingua
          </Text>
        </View>

        {/* Headline + subtitle */}
        <View className="mt-6 pl-3">
          {/* One line only: shrink a little on narrow screens instead of
              cutting the text, and ignore the phone's font size setting. */}
          <Text
            className="typography--display text-text-primary"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            maxFontSizeMultiplier={1}
          >
            Your AI language
          </Text>
          <Text
            className="typography--display text-text-primary"
            numberOfLines={1}
            maxFontSizeMultiplier={1}
          >
            <Text className="text-lingua-deep-purple">teacher</Text>.
          </Text>
          <Text className="mt-1.5 font-poppins text-[14px] leading-[28px] text-text-secondary">
            {"Real conversations, personalized\nlessons, anytime, anywhere."}
          </Text>
        </View>

        {/* Mascot with speech bubbles */}
        <View
          className="mt-4 flex-1 items-center justify-center"
          onLayout={(event) => setStage(event.nativeEvent.layout)}
        >
          {mascotSize > 0 && (
            <View
              style={{
                width: mascotSize,
                height: mascotSize,
                marginTop: mascotSize * 0.08,
              }}
            >
              <Image
                source={images.mascotWelcome}
                className="h-full w-full"
                resizeMode="contain"
              />
              {/* Bubble positions are % of the mascot image, so they stay
                  in the same spot around the fox on every screen size. */}
              <SpeechBubble
                text="Hello!"
                className="left-[8.5%] top-[2%] -rotate-[8deg]"
                bubbleClassName="bg-bubble-blue"
                textClassName="text-text-primary"
                tailSide="right"
              />
              <SpeechBubble
                text="¡Hola!"
                className="left-[62.8%] -top-[2.5%] rotate-[8deg]"
                bubbleClassName="bg-bubble-indigo"
                textClassName="text-bubble-indigo-text"
                tailSide="left"
              />
              <SpeechBubble
                text="你好!"
                className="left-[73%] top-[19.5%] rotate-[12deg]"
                bubbleClassName="bg-bubble-coral"
                textClassName="text-bubble-coral-text"
                tailSide="left"
              />
            </View>
          )}
        </View>

        {/* Call to action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/sign-up")}
          className="mt-4 h-20 flex-row items-center justify-center rounded-[24px] bg-lingua-deep-purple pr-9"
        >
          <Text className="font-poppins-semibold text-h3 text-white">
            Get Started
          </Text>
          <View className="absolute right-9 size-3 -rotate-45 border-b-2 border-r-2 border-white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
