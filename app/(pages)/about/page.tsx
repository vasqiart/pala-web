import BackgroundPortal from "@/components/BackgroundPortal";
import BackgroundParadogs from "@/components/BackgroundParadogs";
import ScrollSections from "@/components/ScrollSections";
import { ABOUT_BG_IMAGES } from "@/lib/aboutBackgroundImages";
import { ABOUT_SECTIONS } from "@/lib/sections";

/** TOP と同数（濃さ・動きも同一）。ABOUT は配置とサイズだけで「少し遊ぶ」 */
const TOP_BG_COUNT = 16;

export default function AboutPage() {
  return (
    <>
      <BackgroundPortal usePortalOnMobile>
        <BackgroundParadogs
          imagePaths={ABOUT_BG_IMAGES}
          count={TOP_BG_COUNT}
          placementMode="collisionFree"
          sizeScale={1.12}
          minCountMobile={18}
        />
      </BackgroundPortal>
      <div className="relative" style={{ zIndex: 10 }}>
        <ScrollSections
          sections={ABOUT_SECTIONS}
          topSpacer={false}
          pageTitle="ABOUT"
          pageSubtitle="What This Is"
          markCardsForBackground
        />
      </div>
    </>
  );
}
