/**
 * ABOUT ページ背景用キャラ画像プール（public 配下のパス・先頭 / 必須）
 * public/paradog/about_bg/about_bg_01.png ... about_bg_18.png
 */
const ABOUT_BG_BASE = "/paradog/about_bg";

export const ABOUT_BG_IMAGES: string[] = Array.from(
  { length: 18 },
  (_, i) => `${ABOUT_BG_BASE}/about_bg_${String(i + 1).padStart(2, "0")}.png`
);
