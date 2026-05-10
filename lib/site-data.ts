import siteData from "@/content/site-data.json";

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  filter?: string;
};

export type FooterGroup = {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};

export const topNavLinks = siteData.topNavLinks as NavLink[];
export const footerGroups = siteData.footerGroups as FooterGroup[];
