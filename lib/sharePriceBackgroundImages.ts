/**
 * SHARE PRICE ページ背景用キャラ画像プール（public 配下のパス・先頭 / 必須）
 * public/paradog/share_price_bg/share_price_background_001.png ... 017.png
 */
const SHARE_PRICE_BG_BASE = "/paradog/share_price_bg";

export const SHARE_PRICE_BG_IMAGES: string[] = Array.from(
  { length: 17 },
  (_, i) => `${SHARE_PRICE_BG_BASE}/share_price_background_${String(i + 1).padStart(3, "0")}.png`
);
