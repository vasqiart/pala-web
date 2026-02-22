/**
 * EARNINGS ページ背景用キャラ画像プール（public 配下のパス・先頭 / 必須）
 * public/paradog/earnings_bg/earnings_background_001.png ... 016.png
 */
const EARNINGS_BG_BASE = "/paradog/earnings_bg";

export const EARNINGS_BG_IMAGES: string[] = Array.from(
  { length: 16 },
  (_, i) => `${EARNINGS_BG_BASE}/earnings_background_${String(i + 1).padStart(3, "0")}.png`
);
