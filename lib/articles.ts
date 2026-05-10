import fs from "node:fs";
import path from "node:path";
import { validateArticlesJson } from "@/lib/json-validation";

type ArticleRecord = {
  slug: string;
  title: string;
  snippet: string;
  content: string[];
  publishedAt: string;
  author: string;
  labels: string[];
  metaTitle: string;
  metaDescription: string;
};

export type Article = ArticleRecord & {
  date: string;
  path: string;
};

function loadArticlesJson(): ArticleRecord[] {
  const filePath = path.join(process.cwd(), "content", "articles.json");

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    const validation = validateArticlesJson(parsed);
    if (validation.errors.length) {
      console.error("Schema validation failed for content/articles.json:");
      validation.errors.forEach((error) => console.error(`  - ${error}`));
      console.error(`Using ${validation.data.length} valid article records after validation.`);
    }
    return validation.data;
  } catch (error) {
    console.error("Failed to read content/articles.json. Falling back to empty list.", error);
    return [];
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export const articles: Article[] = loadArticlesJson().map((article) => ({
  ...article,
  date: formatDate(article.publishedAt),
  path: `/articles/${article.slug}`,
}));

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
