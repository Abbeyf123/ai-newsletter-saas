export type Categories = {
  id: string;
  name: string;
  description: string;
};

export type DeliveryFrequency = "daily" | "weekly" | "biweekly";

export type FrequencyOption = {
  id: DeliveryFrequency;
  name: string;
  description: string;
};

export const categories: Categories[] = [
  {
    id: "ai",
    name: "AI",
    description: "Latest news and updates in artificial intelligence",
  },
  {
    id: "business",
    name: "Business",
    description: "Insights and trends in the business world",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Updates on movies, music, and celebrity news",
  },
  {
    id: "health",
    name: "Health",
    description: "Information on health, wellness, and medical research",
  },
  {
    id: "science",
    name: "Science",
    description: "Discoveries and advancements in science and technology",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Scores, news, and updates from the world of sports",
  },
  {
    id: "politics",
    name: "Politics",
    description: "Political news, analysis, and commentary",
  },
];

export const frequencyOptions: FrequencyOption[] = [
  { id: "daily" , name: "Daily", description: "Every day" },
  { id: "weekly" , name: "Weekly", description: "Once a week" },
  { id: "biweekly" , name: "Bi-weekly", description: "Once a month" },
];
