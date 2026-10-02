import type { Metadata } from "next";
import StoriesGallery from "@/components/StoriesGallery";
import { STORIES } from "@/lib/stories";

export const metadata: Metadata = {
  title: "STORIES | ぱらどっぐ × Palantir",
  description: "People & Palantir — パランティアに惹かれた、それぞれの理由。",
};

export default function StoriesPage() {
  return <StoriesGallery stories={STORIES} />;
}
