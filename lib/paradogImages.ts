/**
 * ぱらどっぐ画像パス一覧（1箇所で管理）
 * FV用のみ使用。必ず public/images/paradog/fv/ の出力と一致させる。
 * 参照URL: /images/paradog/fv/paradog-fv-01.png ... paradog-fv-16.png（旧 01.webp 等は廃止）
 */
const FV_BASE = "/images/paradog/fv";

/** FV用16枚（Hero/ParadogCluster はこれのみ参照） */
export const PARADOG_IMAGE_PATHS: string[] = Array.from(
  { length: 16 },
  (_, i) => `${FV_BASE}/paradog-fv-${String(i + 1).padStart(2, "0")}.png`
);

/** Primary: FV中央配置用（16枚全て） */
export const PRIMARY_IMAGES = PARADOG_IMAGE_PATHS;

/** Secondary: カード周辺装飾用（必要なら一部を再利用） */
export const SECONDARY_IMAGES = PARADOG_IMAGE_PATHS.slice(0, 8);

/** Floating用インデックス（軽い揺れ用。やりすぎない） */
export const FLOATING_INDICES = [0, 3, 7, 11, 15];
