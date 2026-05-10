import InfoPage from "@/components/info-page";

export default function ContactPage() {
  return (
    <InfoPage
      intro="For general questions, corrections, partnership requests, or site-related issues, use the contact details below."
      sections={[
        {
          heading: "Contact Channels",
          body: [
            "Telegram: https://t.me/yosintvlive",
            "For a production site, you can replace this placeholder section with your preferred business email, feedback form, or official support channel.",
          ],
        },
        {
          heading: "Response Scope",
          body: [
            "YoSinTV can use this page for editorial corrections, advertising inquiries, copyright questions, and general visitor feedback.",
            "If you want, we can later turn this into a working contact form backed by email or an API endpoint.",
          ],
        },
      ]}
      title="Contact"
    />
  );
}
