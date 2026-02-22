import CompanyBackground from "@/components/CompanyBackground";
import ScrollSections from "@/components/ScrollSections";
import { COMPANY_SECTIONS } from "@/lib/sections";

export default function CompanyPage() {
  return (
    <>
      <CompanyBackground />
      <div className="relative" style={{ zIndex: 10 }}>
        <ScrollSections
          sections={COMPANY_SECTIONS}
          topSpacer={false}
          pageTitle="Palantir"
          pageSubtitle="Company Profile"
        />
      </div>
    </>
  );
}
