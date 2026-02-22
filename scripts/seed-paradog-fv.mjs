#!/usr/bin/env node
/**
 * public/images/paradog/fv に paradog-fv-01.png ... 16.png の
 * プレースホルダー（1024x1024 透過PNG）を生成する。prepare:paradog 出力と同じサイズで整合。
 * 実画像で上書きする場合は _incoming/paradog に16枚入れて npm run prepare:paradog を実行。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FV_DIR = path.join(ROOT, "public", "images", "paradog", "fv");
const FV_CANVAS = 1024;

async function main() {
  if (!fs.existsSync(FV_DIR)) {
    fs.mkdirSync(FV_DIR, { recursive: true });
  }
  const transparent = await sharp({
    create: {
      width: FV_CANVAS,
      height: FV_CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();

  for (let i = 1; i <= 16; i++) {
    const name = `paradog-fv-${String(i).padStart(2, "0")}.png`;
    fs.writeFileSync(path.join(FV_DIR, name), transparent);
  }
  console.log(`Seeded 16 x ${FV_CANVAS}x${FV_CANVAS} transparent PNGs in public/images/paradog/fv`);
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
