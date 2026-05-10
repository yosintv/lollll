"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TelegramJoinBar } from "@/components/yosintv-home";
import { footerGroups, topNavLinks } from "@/lib/site-data";

type SiteShellProps = {
  children: React.ReactNode;
};

const DARK_MODE_KEY = "ystDm";

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedDarkMode = window.localStorage.getItem(DARK_MODE_KEY) === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dk", savedDarkMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dk", darkMode);
    window.localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  const submitSearch = () => {
    const query = search.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  return (
    <>
      <header id="yst-hdr">
        <TelegramJoinBar />
        <div className="hdr-in">
          <Link className="logo" href="/">
            <img alt="YoSinTV" src="https://web.cricfoot.net/logo.png" />
            <span className="logo-fallback">YoSinTV</span>
          </Link>
          <div className="hdr-r">
            <div className="search-form">
              <div className="sw">
                <span aria-hidden="true" className="sic">
                  &#8981;
                </span>
                <input
                  className="si"
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitSearch();
                    }
                  }}
                  placeholder="Search..."
                  type="text"
                  value={search}
                />
              </div>
            </div>
            <label className="tgl" title="Dark Mode">
              <input
                checked={darkMode}
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
          {topNavLinks.map((link) =>
            link.external ? (
              <a
                className="nl"
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ) : (
              <Link
                className={`nl ${pathname === "/" && link.href === "/" ? "active" : ""}`}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </nav>

      {children}

      <footer className="yst-ft">
        <div className="ft-in">
          <div className="ft-grid">
            <div>
              <img alt="YoSinTV" className="footer-logo" src="https://web.cricfoot.net/logo.png" />
              <p className="footer-copy">
                YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. 
              </p>
              <div className="socrow">
                <a className="socbtn" href="https://t.me/yosintvlive" rel="noreferrer" target="_blank">
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
                      {link.external ? (
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
    </>
  );
}
