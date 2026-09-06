import { sendNewsletterEmail } from "@/lib/utils/email";
import { fetchArticles } from "@/lib/utils/news";
import { buildNewsletterPrompt } from "@/lib/utils/prompt";

import type { NewsletterContent } from "@/types/newsletter";

import { inngest } from "../client";
import { NewsArticle } from "@/lib/utils/news";
import { createClient } from "@/lib/supabase/server";

export default inngest.createFunction(
  {
    id: "newsletter/scheduled",
    retries: 3,
    triggers: {
      event: "newsletter.schedule",
    },
    cancelOn: [
      {
        event: "newsletter.schedule.deleted",
        if: "async.data.userId === event.data.userId",
      },
    ],
  },

  async ({ event, step, runId }) => {
    const { categories, email, frequency, userId } = event.data;

    const isUserActive = await step.run("check-user-status", async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("user_preferences")
        .select("is_active")
        .eq("user_id", userId)
        .single();

      if (error) {
        return false;
      }

      return data.is_active || false;
    });

    if (!isUserActive) {
      return {};
    }

    //  STEP 1 Fetch articles

    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    if (allArticles.length === 0) {
      throw new Error("No articles were found for the selected categories.");
    }

    //  STEP 2 Remove duplicate URLs.

    const uniqueArticles = Array.from(
      new Map(
        allArticles.map((article: NewsArticle) => [article.url, article]),
      ).values(),
    );

    /*
     * STEP 3
     * Ask Gemini to select and summarize
     * the strongest stories.
     */
    const aiResponse = await step.ai.infer("summarize-news", {
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

                  required: ["title", "category", "summary", "source", "url"],
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
    });

    // STEP 4 Extract and parse Gemini's JSON.

    const newsletter = await step.run(
      "parse-newsletter",
      async (): Promise<NewsletterContent> => {
        const parts = aiResponse.candidates?.[0]?.content?.parts;

        if (!parts?.length) {
          throw new Error("Gemini returned an empty response.");
        }

        const textPart = parts.find(
          (part): part is { text: string } =>
            "text" in part && typeof part.text === "string",
        );

        const text = textPart?.text;

        if (!text) {
          throw new Error("Gemini response did not contain text.");
        }

        try {
          return JSON.parse(text) as NewsletterContent;
        } catch {
          throw new Error("Gemini returned invalid JSON.");
        }
      },
    );

    //  STEP 5 Send through Resend.
    const emailResult = await step.run("send-newsletter-email", async () => {
      return sendNewsletterEmail({
        email,
        newsletter,
      });
    });

    // schedule the next newsletter based on the user's frequency preference
    await step.run("schedule-next", async () => {
      const now = new Date();
      let nextScheduleTime: Date;

      switch (frequency) {
        case "weekly":
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
          break;
        case "biweekly":
          nextScheduleTime = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
          break;
        case "monthly":
          nextScheduleTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month
          break;
        default:
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
      }

      nextScheduleTime.setHours(9, 0, 0, 0); // Set to 9:00 AM

      await inngest.send({
        name: "newsletter.schedule",
        data: {
          categories,
          email,
          frequency,
          userId,
        },
        ts: nextScheduleTime.getTime(),
      });

      return {
        success: true,
        runId,
        email,
        emailId: emailResult?.data?.id ?? null,
        articleCount: allArticles.length,
        selectedStoryCount: newsletter.stories.length,
      };
    });
  },
);
