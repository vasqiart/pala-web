import EarningsBackground from "@/components/EarningsBackground";
import ScrollSections from "@/components/ScrollSections";
import { EARNINGS_SECTIONS } from "@/lib/sections";

export default function EarningsPage() {
  return (
    <>
      <EarningsBackground />
      <div className="relative" style={{ zIndex: 10 }}>
        <ScrollSections
          sections={EARNINGS_SECTIONS}
          topSpacer={false}
          pageTitle="EARNINGS"
          pageSubtitle="Performance Update"
        />
      </div>
    </>
  );
}
