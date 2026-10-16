import { Redirect, useRouter } from "expo-router";
import Tabs from "expo-router/js-tabs";

import { TabBar } from "@/components/TabBar";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function TabsLayout() {
  const router = useRouter();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const currentLesson = useCurrentLesson();

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
      <Tabs.Screen
        name="ai-teacher"
        options={{ title: "AI Teacher" }}
        listeners={{
          // Pressing the tab opens the AI class of the lesson the learner is on.
          tabPress: (event) => {
            if (!currentLesson) {
              return; // no lessons yet: show the tab's own empty state
            }
            event.preventDefault();
            router.push({
              pathname: "/lesson/[id]",
              params: { id: currentLesson.id, tab: "ai-teacher" },
            });
          },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
