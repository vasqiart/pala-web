import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import StoriesGallery from "@/components/StoriesGallery";
import { getStoryDecorations } from "@/lib/storyDecorations";
import { STORIES } from "@/lib/stories";

export const metadata: Metadata = {
  title: "STORIES | ぱらどっぐ × Palantir",
  description: "People & Palantir — パランティアに惹かれた、それぞれの理由。",
};

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const [decorations, readerDecorations] = await Promise.all([
    getStoryDecorations("decorations"),
    getStoryDecorations("reader-decorations"),
  ]);
  const decoratedStories = STORIES.map((story) => ({
    ...story,
    decoration: story.decoration ?? (decorations.length ? decorations[randomInt(decorations.length)] : undefined),
  }));
  return <StoriesGallery stories={decoratedStories} readerDecorations={readerDecorations} />;
}
