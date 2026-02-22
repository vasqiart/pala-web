import SharePriceBackground from "@/components/SharePriceBackground";
import ScrollSections from "@/components/ScrollSections";
import { PRICE_SECTIONS } from "@/lib/sections";

export default function PricePage() {
  return (
    <>
      <SharePriceBackground />
      <div className="relative" style={{ zIndex: 10 }}>
        <ScrollSections
          sections={PRICE_SECTIONS}
          topSpacer={false}
          pageTitle="SHARE PRICE"
          pageSubtitle="Market Snapshot"
        />
      </div>
    </>
  );
}
