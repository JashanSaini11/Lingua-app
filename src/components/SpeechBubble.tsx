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
      <View className={`rounded-[20px] px-[22px] py-[17px] ${bubbleClassName}`}>
        <Text className={`font-poppins-medium text-h3 ${textClassName}`}>
          {text}
        </Text>
      </View>
    </View>
  );
}
