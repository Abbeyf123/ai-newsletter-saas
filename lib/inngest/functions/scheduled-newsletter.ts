import { sendNewsletterEmail } from "@/lib/email";
import { inngest } from "../client";
import { fetchArticles } from "@/lib/news";

export default inngest.createFunction(
  { id: "newsletter/scheduled", triggers: { event: "newsletter.schedule" } },
  
  async ({ event, step, runId }) => {
    const categories = event.data.categories;
    //fetch articles per category
    const allArticles = await step.run("fetch-news", async () => {
      return await fetchArticles(categories);
    });

    //generate AI summary

    const summary = await step.ai.infer("summarize-news", {
      model: step.ai.models.gemini({
        model: "gemini-3.6-flash",
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
            You are an expert newsletter editor creating a personalized newsletter.
            Write a concise, engaging summary that:
            Highlights the most important stories
            Provides context and insights
            Uses a friendly, conversational tone
            Is well-structured with clear sections
            Keeps the reader informed and engaged
            Format the response as a proper newsletter with a title and organized content.
            Make it email-friendly with clear sections and engaging subject lines.,


            Here are the articles to summarize from the past week:
            categories requested: ${categories.join(", ")},
            Articles: ${allArticles
              .map(
                (article, idx) =>
                  `${idx + 1}. ${article.title}\n ${article.description}\n  Source: ${article.url}\n`,
              )
              .join("\n")}

                
                `,
              },
            ],
          },
        ],
      },
    });


    await step.run('send-newletter-email', async () => {
      const email = event.data.email
      await sendNewsletterEmail({email})
    })
    console.log(summary)
    return {
      
    }
  },
);
