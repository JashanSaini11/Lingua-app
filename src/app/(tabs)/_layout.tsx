import { Redirect } from "expo-router";
import Tabs from "expo-router/js-tabs";

import { TabBar } from "@/components/TabBar";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function TabsLayout() {
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

  // Signed in users must pick a language before they can see the app.
  if (!selectedLanguage) {
    return <Redirect href="/language" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
