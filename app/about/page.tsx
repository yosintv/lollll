import InfoPage from "@/components/info-page";

export default function AboutPage() {
  return (
    <InfoPage
      intro="YoSinTV covers cricket and football with a focus on fast match context, lineup tracking, previews, and fan-friendly updates."
      sections={[
        {
          heading: "What We Publish",
          body: [
            "YoSinTV is built to help visitors quickly find live match context, probable playing XIs, fixture notes, and preview-style coverage across major cricket and football competitions.",
            "The site format prioritizes clean scanning on mobile and desktop so match-day readers can move from headline to article to updates without friction.",
          ],
        },
        {
          heading: "Editorial Direction",
          body: [
            "Our pages are designed around match relevance, timely team news, and short-form analysis that is easy to follow even when fixtures are moving quickly.",
            "As the site grows, YoSinTV can expand into richer editorial sections, dedicated competitions, and deeper match analysis without changing its core reading experience.",
          ],
        },
      ]}
      title="About YoSinTV"
    />
  );
}
