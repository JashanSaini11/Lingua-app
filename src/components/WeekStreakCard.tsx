import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { getWeekDays } from "@/lib/date";

type WeekStreakCardProps = {
  activeDates: string[]; // days with activity
  streakDays: number;
};

// This week, Monday to Sunday: a flame on every day the learner was active.
export function WeekStreakCard({ activeDates, streakDays }: WeekStreakCardProps) {
  const days = getWeekDays();

  return (
    <View className="home-card home-card--plain mt-6 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-poppins-semibold text-h4 text-text-primary">
          This week
        </Text>
        <Text className="typography--body-sm text-text-secondary">
          {streakDays > 0
            ? `${streakDays} day${streakDays === 1 ? "" : "s"} in a row`
            : "Start a lesson to begin"}
        </Text>
      </View>

      <View className="mt-4 flex-row justify-between">
        {days.map((day) => {
          const isDone = activeDates.includes(day.date);

          return (
            <View key={day.date} className="items-center">
              <Text
                className={`typography--caption mb-2 ${day.isToday ? "font-poppins-semibold text-lingua-deep-purple" : "text-text-secondary"}`}
              >
                {day.label}
              </Text>
              <View
                className={`week-day ${isDone ? "week-day--done" : day.isToday ? "week-day--today" : ""} ${day.isFuture ? "opacity-50" : ""}`}
              >
                {isDone && (
                  <Image
                    source={images.flame}
                    tintColor={colors.white}
                    style={{ width: 18, height: 18 }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
