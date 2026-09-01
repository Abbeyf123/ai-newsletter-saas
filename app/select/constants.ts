import {
  BrainCircuit,
  BriefcaseBusiness,
  Clapperboard,
  FlaskConical,
  HeartPulse,
  Landmark,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type DeliveryFrequency = "daily" | "weekly" | "biweekly";

export type CategoryOption = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const CATEGORIES: CategoryOption[] = [
  {
    id: "ai",
    name: "AI",
    description: "Latest news and updates in artificial intelligence",
    icon: BrainCircuit,
  },
  {
    id: "business",
    name: "Business",
    description: "Insights and trends in the business world",
    icon: BriefcaseBusiness,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Updates on movies, music, and celebrity news",
    icon: Clapperboard,
  },
  {
    id: "health",
    name: "Health",
    description: "Information on health, wellness, and medical research",
    icon: HeartPulse,
  },
  {
    id: "science",
    name: "Science",
    description: "Discoveries and advancements in science and technology",
    icon: FlaskConical,
  },
  {
    id: "sports",
    name: "Sports",
    description: "Scores, news, and updates from the world of sports",
    icon: Trophy,
  },
  {
    id: "politics",
    name: "Politics",
    description: "Political news, analysis, and commentary",
    icon: Landmark,
  },
];

export type FrequencyOption = {
  id: DeliveryFrequency;
  name: string;
  description: string;
};

export const FREQUENCYOPTIONS: FrequencyOption[] = [
  { id: "daily", name: "Daily", description: "Every day" },
  { id: "weekly", name: "Weekly", description: "Once a week" },
  { id: "biweekly", name: "Bi-weekly", description: "Once a month" },
];
