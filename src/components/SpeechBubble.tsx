import { Text, View } from "react-native";

type SpeechBubbleProps = {
  text: string;
  // Position and rotation of the bubble, e.g. "left-[11%] top-[6%] -rotate-6"
  className: string;
  // Background color, shared by the bubble and its tail, e.g. "bg-bubble-blue"
  bubbleClassName: string;
  textClassName: string;
  // Which side of the bubble the tail points from
  tailSide: "left" | "right";
};

export function SpeechBubble({
  text,
  className,
  bubbleClassName,
  textClassName,
  tailSide,
}: SpeechBubbleProps) {
  const tailPosition = tailSide === "left" ? "left-5" : "right-5";

  return (
    <View className={`absolute ${className}`}>
      <View
        className={`absolute -bottom-1.5 size-4 rotate-45 ${tailPosition} ${bubbleClassName}`}
      />
      <View className={`rounded-2xl px-5 py-4 ${bubbleClassName}`}>
        <Text className={`font-poppins-semibold text-h4 ${textClassName}`}>
          {text}
        </Text>
      </View>
    </View>
  );
}
