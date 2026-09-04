import type { Metadata } from "next";
import ResearchGallery from "@/components/ResearchGallery";
import { RESEARCH_MATERIALS } from "@/lib/researchMaterials";

export const metadata: Metadata = {
  title: "RESEARCH | ぱらどっぐ × Palantir",
  description: "Palantirの決算、製品、戦略、Alex Karpの発言を読み解く資料室。",
};

export default function ResearchPage() {
  return <ResearchGallery materials={RESEARCH_MATERIALS} />;
}
