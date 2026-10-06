import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="typography--h1 text-lingua-purple">lingua</Text>
      <Text className="typography--body-md mt-2 text-text-secondary">
        Welcome to Lingua!
      </Text>
    </View>
  );
}
