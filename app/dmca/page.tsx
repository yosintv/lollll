import InfoPage from "@/components/info-page";

export default function DmcaPage() {
  return (
    <InfoPage
      intro="YoSinTV respects the rights of copyright owners and responds to properly submitted copyright concerns."
      sections={[
        {
          heading: "DMCA Position",
          body: [
            "YoSinTV does not claim ownership of third-party media and does not intend to infringe on any copyright holder's rights.",
            "If you believe material referenced by the site violates your rights, you may submit a notice identifying the content in question and the basis of your claim.",
          ],
        },
        {
          heading: "Notice Details",
          body: [
            "A notice should include your contact information, a description of the copyrighted work, the exact URL or material in question, and a statement that you are authorized to act on behalf of the rights holder.",
            "Once a valid request is received, YoSinTV can review the claim and take appropriate action where necessary.",
          ],
        },
      ]}
      title="DMCA"
    />
  );
}
