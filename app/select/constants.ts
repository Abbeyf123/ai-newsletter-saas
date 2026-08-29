import { Cpu, FlaskConical, HeartPulse, Leaf,Trophy, BriefcaseBusiness,

  Clapperboard, Newspaper } from "lucide-react";

export const categories = [
  {
    id: "technology",
    name: "Technology",
    description: "Latest tech news and innovations",
    icon: Cpu,
  },
  {
    id: "business",
    name: "Business",
    description: "Business trends and market updates",
    icon: BriefcaseBusiness,
  },
  {
    id: "sports",
    name: "Sports",
    description: "Sports news and highlights",
    icon: Trophy,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, TV, and celebrity news",
    icon: Clapperboard,
  },
  {
    id: "science",
    name: "Science",
    description: "Scientific discoveries and research",
    icon: FlaskConical,
  },
  {
    id: "health",
    name: "Health",
    description: "Health and wellness updates",
    icon: HeartPulse,
  },
  {
    id: "politics",
    name: "Politics",
    description: "Political news and current events",
    icon: Newspaper,
  },
  {
    id: "environment",
    name: "Environment",
    description: "Climate and environmental news",
    icon: Leaf,
  },
];

export const frequencyOptions = [
  {
    id: "daily",
    name: "Daily",
    description: "Receive a newsletter every day",
  },
  {
    id: "weekly",
    name: "Weekly",
    description: "One newsletter every week",
  },
  {
    id: "biweekly",
    name: "Biweekly",
    description: "Receive updates twice a week",
  },
];
