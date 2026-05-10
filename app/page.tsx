import fs from "node:fs";
import path from "node:path";
import YoSinTVHome from "@/components/yosintv-home";
import type { HomepageNoticeConfig } from "@/components/yosintv-home";
import { articles } from "@/lib/articles";
import { validateEventMatchesJson } from "@/lib/json-validation";

type EventItem = {
  name: string;
  link: string;
  image: string;
};

type SiteConfig = {
  homepagePopup?: HomepageNoticeConfig;
};

function loadEventMatches(fileName: string): EventItem[] {
  const filePath = path.join(process.cwd(), "content", fileName);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    const validation = validateEventMatchesJson(parsed);
    if (validation.errors.length) {
      console.error(`Schema validation failed for content/${fileName}:`);
      validation.errors.forEach((error) => console.error(`  - ${error}`));
      console.error(`Using ${validation.data.length} valid match records after validation.`);
    }
    return validation.data;
  } catch (error) {
    console.error(`Failed to read content/${fileName}. Falling back to empty matches.`, error);
    return [];
  }
}

function loadSiteConfig(): SiteConfig {
  const filePath = path.join(process.cwd(), "content", "site-config.json");

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SiteConfig;
  } catch (error) {
    console.error("Failed to read content/site-config.json. Falling back to default config.", error);
    return {};
  }
}

export default function Page() {
  const siteConfig = loadSiteConfig();

  return (
    <YoSinTVHome
      homepageNotice={siteConfig.homepagePopup}
      initialArticles={articles}
      initialCricketEvents={loadEventMatches("events-cricket.json")}
      initialFootballEvents={loadEventMatches("events-football.json")}
    />
  );
}
