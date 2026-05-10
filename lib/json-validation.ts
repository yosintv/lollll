type ValidationResult<T> = {
  data: T;
  errors: string[];
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readString(
  record: JsonRecord,
  key: string,
  path: string,
  errors: string[],
): string {
  const value = record[key];
  if (isNonEmptyString(value)) {
    return value;
  }
  errors.push(`${path}.${key} must be a non-empty string`);
  return "";
}

function readStringArray(
  record: JsonRecord,
  key: string,
  path: string,
  errors: string[],
): string[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    errors.push(`${path}.${key} must be an array of non-empty strings`);
    return [];
  }

  const result: string[] = [];
  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      errors.push(`${path}.${key}[${index}] must be a non-empty string`);
      return;
    }
    result.push(item);
  });

  return result;
}

export type ArticleJson = {
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

export type EventJson = {
  name: string;
  link: string;
  image: string;
};

export function validateArticlesJson(value: unknown): ValidationResult<ArticleJson[]> {
  const errors: string[] = [];
  if (!Array.isArray(value)) {
    return {
      data: [],
      errors: ["Root value must be an array of articles"],
    };
  }

  const articles: ArticleJson[] = [];
  value.forEach((item, index) => {
    const itemPath = `articles[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object`);
      return;
    }

    const slug = readString(item, "slug", itemPath, errors);
    const title = readString(item, "title", itemPath, errors);
    const snippet = readString(item, "snippet", itemPath, errors);
    const content = readStringArray(item, "content", itemPath, errors);
    const publishedAt = readString(item, "publishedAt", itemPath, errors);
    const author = readString(item, "author", itemPath, errors);
    const labels = readStringArray(item, "labels", itemPath, errors);
    const metaTitle = readString(item, "metaTitle", itemPath, errors);
    const metaDescription = readString(item, "metaDescription", itemPath, errors);

    if (
      slug &&
      title &&
      snippet &&
      content.length &&
      publishedAt &&
      author &&
      labels.length &&
      metaTitle &&
      metaDescription
    ) {
      articles.push({
        slug,
        title,
        snippet,
        content,
        publishedAt,
        author,
        labels,
        metaTitle,
        metaDescription,
      });
    }
  });

  return { data: articles, errors };
}

export function validateEventMatchesJson(value: unknown): ValidationResult<EventJson[]> {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return {
      data: [],
      errors: ["Root value must be an object containing matches"],
    };
  }

  const rawMatches = value.matches;
  if (!Array.isArray(rawMatches)) {
    return {
      data: [],
      errors: ["matches must be an array"],
    };
  }

  const matches: EventJson[] = [];
  rawMatches.forEach((item, index) => {
    const itemPath = `matches[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object`);
      return;
    }

    const name = readString(item, "name", itemPath, errors);
    const link = readString(item, "link", itemPath, errors);
    const image = readString(item, "image", itemPath, errors);

    if (name && link && image) {
      matches.push({ name, link, image });
    }
  });

  return { data: matches, errors };
}
