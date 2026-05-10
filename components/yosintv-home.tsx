"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GoogleAd from "@/components/google-ad";
import type { Article } from "@/lib/articles";
import { footerGroups, topNavLinks } from "@/lib/site-data";

type EventItem = {
  name: string;
  link: string;
  image: string;
};

type MatchTickerItem = {
  name: string;
  href: string;
  sport: "Cricket" | "Football";
};

export type HomepageNoticeConfig = {
  message?: string;
  date?: string;
};

const ARTICLES_PER_PAGE = 5;
const DARK_MODE_KEY = "ystDm";
const HOMEPAGE_NOTICE_KEY_PREFIX = "ystHomepageNoticeV2";
const MAX_LATEST_ARTICLES = 10;
const CRICKET_MATCH_DESTINATION = "https://yosintv.getemoji.online/cricket";
const FOOTBALL_MATCH_DESTINATION = "https://yosintv.getemoji.online/";
const CRICKET_MATCH_API = "https://yosintv-api.pages.dev/api/cricket.json";
const FOOTBALL_MATCH_API = "https://yosintv-api.pages.dev/api/footballl.json";
const TELEGRAM_LINK = "https://t.me/yosintvlive";
const SQUARE_AD_SLOT = "5912194004";

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function HomepageNoticePopup({ config }: { config?: HomepageNoticeConfig }) {
  const [visible, setVisible] = useState(false);
  const message = config?.message?.trim() ?? "";
  const date = config?.date?.trim() ?? "";

  useEffect(() => {
    const today = getTodayKey();

    if (!message || !date) {
      setVisible(false);
      return;
    }

    const storageKey = `${HOMEPAGE_NOTICE_KEY_PREFIX}:${date}:${message}:${today}`;

    if (window.localStorage.getItem(storageKey) === "true") {
      setVisible(false);
      return;
    }

    setVisible(true);
    window.localStorage.setItem(storageKey, "true");

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [date, message]);

  if (!visible) {
    return null;
  }

  return (
    <div aria-live="polite" className="homepage-notice-pop" role="status">
      <button
        aria-label="Close message"
        className="homepage-notice-close"
        onClick={() => setVisible(false)}
        type="button"
      >
        X
      </button>
      <div className="homepage-notice-body">
        <div className="homepage-notice-message">{message}</div>
        <div className="homepage-notice-date">{date}</div>
      </div>
    </div>
  );
}

export function TelegramJoinBar() {
  useEffect(() => {
    document.body.classList.add("has-telegram-bar");

    return () => {
      document.body.classList.remove("has-telegram-bar");
    };
  }, []);

  return (
    <div className="telegram-join-bar">
      <div className="telegram-join-copy">Join YoSinTV Telegram for match updates</div>
      <a className="telegram-join-btn" href={TELEGRAM_LINK} rel="noreferrer" target="_blank">
        Join Now
      </a>
    </div>
  );
}

function StickySquareAd() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore ad push issues during hydration or local development.
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed-square-ad" id="fixedban">
      <div className="fixed-square-ad-box">
        <button
          className="fixed-square-ad-close"
          id="close-fixedban"
          onClick={() => setVisible(false)}
          type="button"
        >
          Close
        </button>
        <div className="fixed-square-ad-inner">
          <ins
            className="adsbygoogle fixed-square-ad-ins"
            data-ad-client="ca-pub-5525538810839147"
            data-ad-slot={SQUARE_AD_SLOT}
          />
        </div>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={`pc ${featured ? "pc-featured" : ""}`}>
      <div className="pb">
        <div className="label-row">
          {article.labels.map((label) => (
            <span className="pl" key={label}>
              {label}
            </span>
          ))}
        </div>
        <Link className="ptitle" href={`/articles/${article.slug}`}>
          {article.title}
        </Link>
        <p className="psnip">{article.snippet}</p>
        <div className="pmeta">
          <span className="pmi">{article.date}</span>
          <span className="pmi">{article.author}</span>
        </div>
        <Link className="rbtn" href={`/articles/${article.slug}`}>
          Read More
        </Link>
      </div>
    </article>
  );
}

function EventList({
  items,
  loading,
  emptyText,
  destinationUrl,
}: {
  items: EventItem[];
  loading: boolean;
  emptyText: string;
  destinationUrl: string;
}) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 2 }, (_, index) => (
          <div className="ev ev-skeleton" key={index}>
            <div className="ev-skel-img skel" />
            <div className="ev-skel-text">
              <div className="skel ev-skel-line ev-skel-line-main" />
              <div className="skel ev-skel-line ev-skel-line-sub" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (!items.length) {
    return <p className="ev-loading">{emptyText}</p>;
  }

  return (
    <>
      {items.map((event) => (
        <a
          className="ev"
          href={destinationUrl}
          key={`${event.name}-${event.link}`}
          rel="noreferrer"
          target="_blank"
        >
          <img alt={event.name} src={event.image || "https://web.cricfoot.net/favico.png"} />
          <span className="ev-t">{event.name}</span>
        </a>
      ))}
    </>
  );
}

export default function YoSinTVHome({
  initialFilter,
  initialSearch,
  initialArticles,
  initialCricketEvents,
  initialFootballEvents,
  homepageNotice,
}: {
  initialFilter?: string;
  initialSearch?: string;
  initialArticles: Article[];
  initialCricketEvents: EventItem[];
  initialFootballEvents: EventItem[];
  homepageNotice?: HomepageNoticeConfig;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch ?? "");
  const [search, setSearch] = useState(initialSearch ?? "");
  const [activeFilter, setActiveFilter] = useState(initialFilter ?? "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cricketEvents] = useState<EventItem[]>(initialCricketEvents);
  const [footballEvents] = useState<EventItem[]>(initialFootballEvents);
  const [matchTickerItems, setMatchTickerItems] = useState<MatchTickerItem[]>([]);
  const allArticles = initialArticles;
  const latestArticles = useMemo(
    () => allArticles.slice(0, MAX_LATEST_ARTICLES),
    [allArticles],
  );

  const categories = useMemo(() => {
    return Array.from(new Set(latestArticles.flatMap((article) => article.labels)));
  }, [latestArticles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return latestArticles.filter((article) => {
      const matchesCategory =
        activeFilter === "all" || article.labels.includes(activeFilter);
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.snippet.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, latestArticles, search]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));

  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [currentPage, filteredArticles]);

  useEffect(() => {
    const savedDarkMode = window.localStorage.getItem(DARK_MODE_KEY) === "true";
    setDarkMode(savedDarkMode);

    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dk", darkMode);
    window.localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySearch = params.get("q") ?? initialSearch ?? "";
    const queryFilter = params.get("filter") ?? initialFilter ?? "all";

    setSearchInput(querySearch);
    setSearch(querySearch);
    setActiveFilter(queryFilter);
  }, [initialFilter, initialSearch]);

  useEffect(() => {
    const loadUpcomingTickerMatches = async () => {
      try {
        const [cricketResponse, footballResponse] = await Promise.all([
          fetch(CRICKET_MATCH_API, { cache: "no-store" }),
          fetch(FOOTBALL_MATCH_API, { cache: "no-store" }),
        ]);

        const [cricketData, footballData] = await Promise.all([
          cricketResponse.json(),
          footballResponse.json(),
        ]);

        const cricketMatches = (Array.isArray(cricketData) ? cricketData : [])
          .slice(0, 12)
          .map((item: EventItem) => ({
            name: item.name,
            href: CRICKET_MATCH_DESTINATION,
            sport: "Cricket" as const,
          }));

        const footballMatches = (Array.isArray(footballData) ? footballData : [])
          .slice(0, 12)
          .map((item: EventItem) => ({
            name: item.name,
            href: FOOTBALL_MATCH_DESTINATION,
            sport: "Football" as const,
          }));

        setMatchTickerItems([...cricketMatches, ...footballMatches]);
      } catch {
        setMatchTickerItems([]);
      }
    };

    loadUpcomingTickerMatches();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const applySearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  return (
    <>
      <HomepageNoticePopup config={homepageNotice} />
      <header id="yst-hdr">
        <TelegramJoinBar />
        <div className="hdr-in">
          <a className="logo" href="/">
            <img alt="YoSinTV" src="https://web.cricfoot.net/logo.png" />
            <span className="logo-fallback">YoSinTV</span>
          </a>
          <div className="hdr-r">
            <div className="search-form">
              <div className="sw">
                <span aria-hidden="true" className="sic">
                  &#8981;
                </span>
                <input
                  className="si"
                  id="yst-s"
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applySearch();
                    }
                  }}
                  placeholder="Search..."
                  type="text"
                  value={searchInput}
                />
              </div>
            </div>
            <label className="tgl" title="Dark Mode">
              <input
                checked={darkMode}
                id="yst-dm"
                onChange={(event) => setDarkMode(event.target.checked)}
                type="checkbox"
              />
              <span className="sldr" />
            </label>
          </div>
        </div>
      </header>

      <nav className="yst-nav">
        <div className="nav-in">
          {topNavLinks.map((item) => {
            const isExternal = item.external || item.href.startsWith("http");
            const isActive = !isExternal && activeFilter === (item.filter ?? "all");
            const className = `nl ${isActive ? "active" : ""}`;

            if (isExternal) {
              return (
                <a className={className} href={item.href} key={item.label} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              );
            }

            return (
              <Link className={className} href={item.href} key={item.label}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {matchTickerItems.length ? (
        <section aria-label="Upcoming Matches" className="match-ticker">
          <div className="match-ticker-track">
            {[...matchTickerItems, ...matchTickerItems].map((item, index) => (
              <a
                className="match-chip"
                href={item.href}
                key={`${item.sport}-${item.name}-${index}`}
                rel="noreferrer"
                target="_blank"
              >
                <span className="match-chip-sport">{item.sport}</span>
                <span className="match-chip-name">{item.name}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="adbar">
        <GoogleAd />
      </div>

      <main className="yst-wrap">
        <div className="yst-content">
          <div className="sh">
            <h2 className="sh-t">All Cricket Events</h2>
            <div className="sh-l" />
            <span className="sh-b">Live</span>
          </div>
          <div className="evg">
            <EventList
              emptyText="No cricket events found."
              items={cricketEvents}
              loading={false}
              destinationUrl={CRICKET_MATCH_DESTINATION}
            />
          </div>

          <div className="sh spaced-top">
            <h2 className="sh-t">All Football Events</h2>
            <div className="sh-l" />
            <span className="sh-b">Live</span>
          </div>
          <div className="evg">
            <EventList
              emptyText="No football events found."
              items={footballEvents}
              loading={false}
              destinationUrl={FOOTBALL_MATCH_DESTINATION}
            />
          </div>

          <div className="sh spaced-top">
            <h2 className="sh-t">Latest Articles</h2>
            <div className="sh-l" />
          </div>

          <div className="filter-row">
            <button
              className={`fpill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              All
            </button>
            {categories.map((category) => (
              <button
                className={`fpill ${activeFilter === category ? "active" : ""}`}
                key={category}
                onClick={() => setActiveFilter(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="articles-container">
            {pagedArticles.length ? (
              <>
                <div className="articles-summary">
                  {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"} found
                </div>
                <div className="articles-lead">
                  <ArticleCard article={pagedArticles[0]} featured />
                </div>
                <div className="articles-stack">
                  {pagedArticles.slice(1).map((article) => (
                    <ArticleCard article={article} key={article.title} />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">No articles found.</div>
            )}
          </div>

          {filteredArticles.length > ARTICLES_PER_PAGE ? (
            <div className="pg">
              <button
                className="pg-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Newer
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={`pg-btn ${page === currentPage ? "active" : ""}`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                className="pg-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                Older
              </button>
            </div>
          ) : null}
        </div>

        <aside className="yst-aside">
          <div className="wgt">
            <div className="wgt-h">Recent Posts</div>
            <div className="wgt-b recent-list">
              {latestArticles.slice(0, 5).map((article) => (
                <Link className="rp-item" href={`/articles/${article.slug}`} key={article.title}>
                  <span className="rp-t">{article.title}</span>
                  <span className="rp-d">{article.date}</span>
                </Link>
              ))}
            </div>
          </div>

          <GoogleAd className="sidebar-ad" label="Advertisement" />
        </aside>
      </main>

      <div className="page-shell">
        <div className="dmca">
          <div className="dmca-h">YoSinTV - DMCA Notice</div>
          <p>
            YoSinTV does not host any media content on its own servers. Visitors may use
            external or third-party services to view content, and any shared links are
            hosted elsewhere on the web.
          </p>
        </div>
      </div>

      <div className="bottom-ad page-shell">
        <GoogleAd />
      </div>

      <footer className="yst-ft">
        <div className="ft-in">
          <div className="ft-grid">
            <div>
              <img
                alt="YoSinTV"
                className="footer-logo"
                src="https://web.cricfoot.net/logo.png"
              />
              <p className="footer-copy">
                YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. 
              </p>
              <div className="socrow">
                <a
                  className="socbtn"
                  href="https://t.me/yosintvlive"
                  rel="noreferrer"
                  target="_blank"
                >
                  Telegram
                </a>
                <a
                  className="socbtn"
                  href="https://www.cricfoot.net/?ads=yosintv.net"
                  rel="noreferrer"
                  target="_blank"
                >
                  Highlights
                </a>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <div className="ft-ht">{group.title}</div>
                <ul className="ft-ul">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a href={link.href} rel="noreferrer" target="_blank">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ft-bot">
            <p>
              &copy; {new Date().getFullYear()} <Link href="/">YoSinTV</Link>. All rights reserved.{" "}
              <Link href="/privacy-policy">Privacy</Link> · <Link href="/disclaimer">Disclaimer</Link> ·{" "}
              <Link href="/dmca">DMCA</Link>
            </p>
          </div>
        </div>
      </footer>

      <StickySquareAd />

      <button
        className={`btt ${showBackToTop ? "on" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
        type="button"
      >
        ▲
      </button>
    </>
  );
}
