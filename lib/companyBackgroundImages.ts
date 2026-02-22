/**
 * COMPANY（PALANTIR）ページ背景用キャラ画像プール（public 配下のパス・先頭 / 必須）
 * public/paradog/company_bg/palantir_page_001.png ... 016.png
 */
const COMPANY_BG_BASE = "/paradog/company_bg";

export const COMPANY_BG_IMAGES: string[] = Array.from(
  { length: 16 },
  (_, i) =>
    `${COMPANY_BG_BASE}/palantir_page_${String(i + 1).padStart(3, "0")}.png`
);
