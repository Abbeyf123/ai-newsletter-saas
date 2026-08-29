import axios from "axios";

interface NewsArticle {
  title: string;
  url: string;
  description: string;
}

export async function fetchArticles(
  categories: string[],
): Promise<Array<NewsArticle>> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const promises = categories.map(async (category) => {
    const params = {
      category: encodeURIComponent(category),
      from: since,
      sortBy: "publishedAt",
      apiKey: process.env.NEWS_API_KEY,
    };
    const url = "https://newsapi.org/v2/everything";

    try {
      const response = await axios.get(url, { params });
      const data = await response.data

      return data.articles.slice(0,5).map((article:NewsArticle ) => ({
        title: article.title || '',
        url: article.url || '',
        description: article.description || 'No description available'
      }))

    } catch (error) {
        console.error('error fetching news', error)
        return []
    }
  });

  const results = await Promise.all(promises)
  return results.flat()
}
