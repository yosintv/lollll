import InfoPage from "@/components/info-page";

export default function DisclaimerPage() {
  return (
    <InfoPage
      intro="The information on YoSinTV is provided for general informational purposes and may change without notice."
      sections={[
        {
          heading: "Content Accuracy",
          body: [
            "YoSinTV aims to keep match listings, previews, and lineup-related information useful and timely, but accuracy cannot be guaranteed for every event, kickoff change, or late squad update.",
            "Visitors should confirm critical details from official competition, club, or broadcaster sources when precision is essential.",
          ],
        },
        {
          heading: "External Links",
          body: [
            "The site may link to third-party pages and services for highlights, updates, or community channels. YoSinTV does not control the content or practices of those destinations.",
            "Use of any external website or service is at the visitor's own discretion and subject to the third party's own terms and policies.",
          ],
        },
      ]}
      title="Disclaimer"
    />
  );
}
