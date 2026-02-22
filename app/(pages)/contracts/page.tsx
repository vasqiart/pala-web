import ScrollSections from "@/components/ScrollSections";
import { CONTRACTS_SECTIONS } from "@/lib/sections";

export default function ContractsPage() {
  return (
    <ScrollSections
      sections={CONTRACTS_SECTIONS}
      topSpacer={false}
      pageTitle="CONTRACTS"
      pageSubtitle="Dominate"
    />
  );
}
