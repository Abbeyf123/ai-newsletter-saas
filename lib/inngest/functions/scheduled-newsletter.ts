import { sendNewsletterEmail } from "@/lib/utils/email";
import { fetchArticles } from "@/lib/utils/news";
import { buildNewsletterPrompt } from "@/lib/utils/prompt";

import type { NewsletterContent } from "@/types/newsletter";

import { inngest } from "../client";
import { NewsArticle } from "@/lib/utils/news";

export default inngest.createFunction(
  {
    id: "newsletter/scheduled",
    retries: 3,
    triggers: {
      event: "newsletter.schedule",
    },
  },

  async ({ event, step, runId }) => {
    const { categories, email } = event.data;

    /**
     * STEP 1
     * Fetch articles.
     */
    const allArticles = await step.run(
      "fetch-news",
      async () => {
        return fetchArticles(categories);
      },
    );

    if (allArticles.length === 0) {
      throw new Error(
        "No articles were found for the selected categories.",
      );
    }

    /**
     * STEP 2
     * Remove duplicate URLs.
     */
    const uniqueArticles = Array.from(
      new Map(
        allArticles.map((article:NewsArticle) => [
          article.url,
          article,
        ]),
      ).values(),
    );

    /**
     * STEP 3
     * Ask Gemini to select and summarize
     * the strongest stories.
     */
    const aiResponse = await step.ai.infer(
      "summarize-news",
      {
        model: step.ai.models.gemini({
          model: "gemini-3.6-flash",
        }),

        body: {
          contents: [
            {
              role: "user",

              parts: [
                {
                  text: buildNewsletterPrompt({
                    categories,
                    articles: uniqueArticles,
                  }),
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.3,

            responseMimeType: "application/json",

            responseSchema: {
              type: "object",

              properties: {
                subject: {
                  type: "string",
                },

                previewText: {
                  type: "string",
                },

                title: {
                  type: "string",
                },

                introduction: {
                  type: "string",
                },

                stories: {
                  type: "array",

                  items: {
                    type: "object",

                    properties: {
                      title: {
                        type: "string",
                      },

                      category: {
                        type: "string",
                      },

                      summary: {
                        type: "string",
                      },

                      source: {
                        type: "string",
                      },

                      url: {
                        type: "string",
                      },
                    },

                    required: [
                      "title",
                      "category",
                      "summary",
                      "source",
                      "url",
                    ],
                  },
                },

                closing: {
                  type: "string",
                },
              },

              required: [
                "subject",
                "previewText",
                "title",
                "introduction",
                "stories",
                "closing",
              ],
            },
          },
        },
      },
    );

    /**
     * STEP 4
     * Extract and parse Gemini's JSON.
     */
    const newsletter = await step.run(
      "parse-newsletter",
      async (): Promise<NewsletterContent> => {
        const parts =
          aiResponse.candidates?.[0]?.content?.parts;

        if (!parts?.length) {
          throw new Error(
            "Gemini returned an empty response.",
          );
        }

        const textPart = parts.find(
          (
            part,
          ): part is { text: string } =>
            "text" in part &&
            typeof part.text === "string",
        );

        const text = textPart?.text;

        if (!text) {
          throw new Error(
            "Gemini response did not contain text.",
          );
        }

        try {
          return JSON.parse(text) as NewsletterContent;
        } catch {
          throw new Error(
            "Gemini returned invalid JSON.",
          );
        }
      },
    );

    /**
     * STEP 5
     * Send through Resend.
     */
    const emailResult = await step.run(
      "send-newsletter-email",
      async () => {
        return sendNewsletterEmail({
          email,
          newsletter,
        });
      },
    );

    return {
      success: true,
      runId,
      email,
      emailId: emailResult?.data?.id ?? null,
      articleCount: allArticles.length,
      selectedStoryCount: newsletter.stories.length,
    };
  },
);