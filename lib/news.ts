import axios from "axios";

interface NewsArticle {
  title: string;
  url: string;
  description: string;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;
export async function fetchArticles(
  categories: string[],
): Promise<Array<NewsArticle>> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // const promises = categories.map(async (category) => {
  //   const url = "https://newsapi.org/v2/everything";

  //   const params = {
  //     q: category,            // Everything endpoint requires `q` (query keywords) instead of `category`
  //     from: since,            // Supported on /v2/everything
  //     sortBy: "publishedAt",  // Supported on /v2/everything
  //     pageSize: 5,            // Fetches only 5 results directly from the API
  //     language: "en"          // Recommended to avoid unexpected non-English results
  //   };

  //   try {
  //     const response = await axios.get(url, {
  //       params,               // Axios automatically URL-encodes params
  //       headers: {
  //         'X-Api-Key': NEWS_API_KEY
  //       }
  //     });

  //     // response.data is already parsed by Axios, no 'await' needed
  //     return response.data.articles.map((article: NewsArticle) => ({
  //       title: article.title || "",
  //       url: article.url || "",
  //       description: article.description || "No description available",
  //     }));
  //   } catch (error) {
  //     console.error(`Error fetching news for query "${category}":`, error);
  //     return [];
  //   }
  // });

  // const results = await Promise.all(promises);
  const results = [{
    description:
      "Moderna led the S&P 500 in August after reporting promising results from a late-stage trial of a personalized mRNA cancer vaccine it co-developed with Merck, according to CNBC. The data challenged years of skepticism about whether the company's mRNA technolog…",
    title: "S&P 500 biggest August 2026 winners: Moderna, software stocks",
    url: "https://biztoc.com/x/6b4b6e3d98dab8a2",
  }];
  return results;
}
