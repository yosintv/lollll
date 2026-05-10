import fs from "node:fs";
import path from "node:path";

export const siteName = "YoSinTV";
export const siteDescription =
  "YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. ";
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const sitePathPrefix = isGithubPages ? "/yosintvnxt" : "";

type SiteConfig = {
  currentDomain?: string;
};

function normalizeDomain(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return withProtocol.replace(/\/$/, "");
}

function readConfiguredDomain() {
  try {
    const configPath = path.join(process.cwd(), "content", "site-config.json");
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw) as SiteConfig;
    return normalizeDomain(parsed.currentDomain);
  } catch {
    return null;
  }
}

function readCnameDomain() {
  try {
    const cnamePath = path.join(process.cwd(), "CNAME");
    const raw = fs.readFileSync(cnamePath, "utf-8").trim();
    return normalizeDomain(raw);
  } catch {
    return null;
  }
}

const configuredDomain = readConfiguredDomain();
const cnameDomain = readCnameDomain();
const defaultSiteUrl =
  configuredDomain ||
  cnameDomain ||
  (isGithubPages ? "https://yosintv.github.io" : "http://localhost:3000");

export const siteUrl =
  normalizeDomain(process.env.NEXT_PUBLIC_SITE_URL) || defaultSiteUrl;

export function absoluteUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${sitePathPrefix}${normalizedPath === "/" ? "/" : normalizedPath}`;
}
