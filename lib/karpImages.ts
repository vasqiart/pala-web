/**
 * KARP ページ用ギャラリー画像リスト。
 * 実画像は scripts/prepare-karp-gallery.mjs 実行で public/karp/ に配置され、
 * KARP_IMAGES は lib/karpImages.generated.ts に出力される（当ファイルで re-export）。
 */
export type KarpImageItem = {
  id: string;
  src: string;
  alt: string;
};

export { KARP_IMAGES } from "./karpImages.generated";
