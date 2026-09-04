export interface NewsletterStory {
  title: string;
  category: string;
  summary: string;
  source: string;
  url: string;
}

export interface NewsletterContent {
  subject: string;
  previewText: string;
  title: string;
  introduction: string;
  stories: NewsletterStory[];
  closing: string;
}