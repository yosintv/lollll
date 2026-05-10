import InfoPage from "@/components/info-page";

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      intro="This Privacy Policy explains the general types of information YoSinTV may collect and how that information may be used."
      sections={[
        {
          heading: "Information Collection",
          body: [
            "YoSinTV may collect non-personal usage data such as browser type, device details, page visits, and approximate traffic patterns to improve the site experience.",
            "If you later add forms, subscriptions, or direct contact options, any information submitted through those features should be handled according to the data purpose clearly presented at the point of collection.",
          ],
        },
        {
          heading: "Advertising and Third Parties",
          body: [
            "The site uses Google AdSense and may display content or ads from third-party services that apply their own cookies, identifiers, or analytics methods.",
            "Visitors should review the policies of those third-party providers for more detail about how their technologies operate.",
          ],
        },
      ]}
      title="Privacy Policy"
    />
  );
}
