import SiteShell from "@/components/site-shell";

type InfoPageProps = {
  title: string;
  intro: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

export default function InfoPage({ title, intro, sections }: InfoPageProps) {
  return (
    <SiteShell>
      <main className="info-page-shell">
        <div className="info-page-card">
          <p className="info-kicker">YoSinTV</p>
          <h1 className="info-title">{title}</h1>
          <p className="info-intro">{intro}</p>

          <div className="info-sections">
            {sections.map((section) => (
              <section className="info-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
