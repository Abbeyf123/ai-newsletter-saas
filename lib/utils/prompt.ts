import { type NewsArticle } from "./news";

type BuildNewsletterPromptProps = {
  categories: string[];
  articles: NewsArticle[];
};

export function buildNewsletterPrompt({
  categories,
  articles,
}: BuildNewsletterPromptProps) {
  const articleContext = articles
    .map((article, index) => {
      return `
ARTICLE ${index + 1}

Title:
${article.title}

Description:
${article.description || "No description provided"}

Source:
${article.source.name}

Published:
${article.publishedAt}

URL:
${article.url}
`;
    })
    .join("\n---\n");

  return `
You are the editor of a concise personalized weekly news newsletter.

Reader interests:
${categories.join(", ")}

Select the most important supplied stories and turn them into a short,
easy-to-scan newsletter, not a long-form email.

EDITORIAL RULES:
- Choose only the strongest, most relevant stories: important developments,
  major announcements, significant events, or useful information.
- Include no more than 3 stories per category; omit weak, trivial, repetitive,
  duplicate, or substantially similar stories. For the same event, use the
  strongest source.
- Use only information in the supplied articles. Do not invent or speculate
  about facts, statistics, quotes, context, events, or URLs. Preserve each
  article's meaning, and ensure every URL exactly matches a supplied URL.
- Write clear, natural, conversational copy without hype, clickbait,
  sensationalism, exaggerated language, Markdown, or HTML.
- Do not repeat headlines in summaries. Each summary must be concise, explain
  what happened and why it matters when possible, and use no more than 3 short
  sentences with minimal background.

NEWSLETTER STRUCTURE:

subject: A concise, interesting subject under approximately 60 characters.

previewText: Approximately 80-120 characters that complement, not repeat, the subject.

title: A short newsletter heading.

introduction: A very short introduction, maximum 2 sentences, explaining what
this week's newsletter covers.

stories: The selected strongest stories.

Each story must contain: title, category, summary, source, and url.

closing: A short, friendly closing, maximum 1 sentence.

If a category lacks enough strong stories, do not create stories to fill it.

ARTICLES:

${articleContext}
`;
}
