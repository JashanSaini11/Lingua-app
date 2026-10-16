import type { Achievement } from "@/types/learning";

// Every achievement a learner can earn. To add one, copy a row, give it a new
// id and pick the number to reach (`target`) for one of the stats in
// `lib/achievements.ts`. It is earned the moment the stat reaches the target.
export const achievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Finish your first lesson",
    icon: "award",
    tint: "purple",
    stat: "lessons",
    target: 1,
  },
  {
    id: "lessons-3",
    title: "Getting Going",
    description: "Finish 3 lessons",
    icon: "circleCheck",
    tint: "green",
    stat: "lessons",
    target: 3,
  },
  {
    id: "first-practice",
    title: "Practice Time",
    description: "Finish a practice session",
    icon: "words",
    tint: "blue",
    stat: "practice",
    target: 1,
  },
  {
    id: "daily-goal",
    title: "Goal Getter",
    description: "Reach your daily goal",
    icon: "target",
    tint: "orange",
    stat: "goal",
    target: 1,
  },
  {
    id: "streak-3",
    title: "On Fire",
    description: "Learn 3 days in a row",
    icon: "flame",
    tint: "orange",
    stat: "streak",
    target: 3,
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Learn 7 days in a row",
    icon: "flame",
    tint: "red",
    stat: "streak",
    target: 7,
  },
  {
    id: "words-10",
    title: "Word Collector",
    description: "Learn 10 words",
    icon: "bookOpen",
    tint: "blue",
    stat: "words",
    target: 10,
  },
  {
    id: "xp-50",
    title: "XP Hunter",
    description: "Earn 50 XP",
    icon: "zap",
    tint: "yellow",
    stat: "xp",
    target: 50,
  },
];
