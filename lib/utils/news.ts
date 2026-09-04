import axios from "axios";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string
  };
  publishedAt: string;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  throw new Error("NEWS_API_KEY is not configured");
}

export async function fetchArticles(
  categories: string[],
): Promise<NewsArticle[]> {
  const since = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const requests = categories.map(async (category) => {
    try {
      const response = await axios.get(
        "https://newsapi.org/v2/everything",
        {
          params: {
            q: category,
            from: since,
            sortBy: "publishedAt",
            pageSize: 5,
            language: "en",
          },
          headers: {
            "X-Api-Key": NEWS_API_KEY,
          },
        },
      );

      return response.data.articles.map((article: NewsArticle) => ({
        title: article.title ?? "",
        description: article.description ?? "",
        url: article.url ?? "",
        source: article.source?.name ?? "Unknown source",
        publishedAt: article.publishedAt ?? "",
      }));
    } catch (error) {
      console.error(
        `Error fetching news for "${category}":`,
        error,
      );

      return [];
    }
  });

  const results = await Promise.all(requests);

  return results.flat();
}