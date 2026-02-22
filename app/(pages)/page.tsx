import Hero from "@/components/Hero";
import ScrollSections from "@/components/ScrollSections";
import { TOP_SECTIONS } from "@/lib/sections";

export default function TopPage() {
  return (
    <>
      <Hero />
      <ScrollSections sections={TOP_SECTIONS} />
    </>
  );
}
