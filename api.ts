
// api.ts
import { IArticle } from "./types.d.ts";

class Api {
  // private property
  readonly #baseURL: string = "https://newsapi.org/v2/top-headlines";
  #apiKey: string = "";

  // set API key
  constructor(apikey: string) {
    this.#apiKey = apikey;
  }

  getNews = async (
    category: string | undefined,
    query: string | undefined,
  ): Promise<IArticle[] | string> => {
    let additional: string = "";
    let country: string = "IN"; // Use US for USA , refer documentation for the complete list
    if (category) additional += `&category=${category}`;
    if (query) additional += `&q=${encodeURI(query)}`;
    try {
      const rawResult = await fetch(
        `${this.#baseURL}?language=en&pageSize=10${additional}&apiKey=${this.#apiKey}&sortBy=popularity&country=${country}`,
      );
      const result = await rawResult.json();
      if (result.status === "error") return "INVALID_KEY";
      let news: IArticle[] = result.articles;
      return news;
    } catch (err) {
      return "Cannot connect to server. Please check your internet conection";
    }
  };
}

export default Api;