import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoogleAd from "@/components/google-ad";
import ScrollReset from "@/components/scroll-reset";
import SiteShell from "@/components/site-shell";
import { articles, getArticleBySlug } from "@/lib/articles";
import { absoluteUrl, siteName } from "@/lib/site";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | YoSinTV",
    };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: absoluteUrl(article.path),
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: absoluteUrl(article.path),
      siteName,
      type: "article",
      publishedTime: article.publishedAt,
      images: ["https://web.cricfoot.net/favico.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: ["https://web.cricfoot.net/favico.png"],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => ({
      article: candidate,
      score: candidate.labels.filter((label) => article.labels.includes(label)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.article);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: "https://web.cricfoot.net/logo.png",
      },
    },
    image: ["https://web.cricfoot.net/favico.png"],
    mainEntityOfPage: absoluteUrl(article.path),
  };

  return (
    <SiteShell>
      <ScrollReset />
      <div className="page-shell article-top-banner">
        <GoogleAd />
      </div>
      <main className="article-page-shell article-page-grid">
        <article className="article-page-card article-page-main">
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            type="application/ld+json"
          />
          <Link className="article-back" href="/">
            Back to Home
          </Link>
          <p className="article-kicker">{article.labels.join(" · ")}</p>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span>{article.date}</span>
            <span>{article.author}</span>
          </div>
          <p className="article-intro">{article.snippet}</p>
          <div className="article-body">
            {article.content.map((paragraph, index) => (
              <div key={paragraph}>
                <p>{paragraph}</p>
                {index === 0 ? (
                  <div className="article-ad article-ad-inline">
                    <GoogleAd label="Advertisement" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {relatedArticles.length ? (
            <section className="related-articles">
              <div className="sh">
                <h2 className="sh-t">Read More</h2>
                <div className="sh-l" />
              </div>
              <div className="related-grid">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    className="related-card"
                    href={`/articles/${relatedArticle.slug}`}
                    key={relatedArticle.slug}
                  >
                    <div className="label-row">
                      {relatedArticle.labels.slice(0, 2).map((label) => (
                        <span className="pl" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                    <h3 className="related-title">{relatedArticle.title}</h3>
                    <p className="related-snippet">{relatedArticle.snippet}</p>
                    <span className="related-meta">{relatedArticle.date}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
        <aside className="article-page-sidebar">
          <div className="article-sidebar-stick">
            <GoogleAd className="sidebar-ad" label="Advertisement" />
          </div>
        </aside>
      </main>
      <div className="page-shell article-bottom-banner">
        <GoogleAd />
      </div>
    </SiteShell>
  );
}
