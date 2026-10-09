import { randomInt } from "node:crypto";
import type { Metadata } from "next";
import BackgroundParadogs from "@/components/BackgroundParadogs";
import StoriesGallery from "@/components/StoriesGallery";
import { STORIES_BG_IMAGES } from "@/lib/storiesBackgroundImages";
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
  return (
    <>
      <BackgroundParadogs
        imagePaths={[...STORIES_BG_IMAGES]}
        count={14}
        placementMode="collisionFree"
        sizeScale={1.08}
        mobileSizeScale={0.6}
        densityMultiplier={0.64}
        layoutPreset="organic"
        minCountMobile={7}
        maxCount={14}
        maxCountMobile={7}
        containWithinViewport
        seed={20261006}
        avoidSelector="[data-background-avoid], header"
      />
      <StoriesGallery stories={decoratedStories} readerDecorations={readerDecorations} />
    </>
  );
}
