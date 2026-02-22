#!/usr/bin/env node
/**
 * EARNINGS 背景用画像 16 枚を _incoming/paradog/earnings_background から検出し、
 * public/paradog/earnings_bg/ に earnings_background_001.png ... 016.png として配置する。
 * 入力が png/webp/jpg/jpeg のどれでも、出力は常に PNG に統一（sharp で変換）。
 * 並び順はファイル名の自然順。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ALLOWED_EXT = [".png", ".webp", ".jpg", ".jpeg"];
const INCOMING_DIR = path.join(ROOT, "_incoming", "paradog", "earnings_background");
const OUT_DIR = path.join(ROOT, "public", "paradog", "earnings_bg");
const REQUIRED_COUNT = 16;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isImage(name) {
  const ext = path.extname(name).toLowerCase();
  return ALLOWED_EXT.includes(ext);
}

function naturalSortKey(name) {
  const base = path.basename(name, path.extname(name));
  const parts = base.split(/(\d+)/).filter(Boolean);
  return parts.map((p) => (/\d+/.test(p) ? p.padStart(8, "0") : p.toLowerCase()));
}

function sortImageFiles(names) {
  return [...names].sort((a, b) => {
    const ka = naturalSortKey(a);
    const kb = naturalSortKey(b);
    for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
      const va = ka[i] ?? "";
      const vb = kb[i] ?? "";
      if (va !== vb) return va < vb ? -1 : 1;
    }
    return 0;
  });
}

async function main() {
  ensureDir(OUT_DIR);

  if (!fs.existsSync(INCOMING_DIR)) {
    console.error("ERROR: _incoming/paradog/earnings_background が存在しません。");
    process.exit(1);
  }

  const entries = fs.readdirSync(INCOMING_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && isImage(e.name))
    .map((e) => path.join(INCOMING_DIR, e.name));

  if (files.length !== REQUIRED_COUNT) {
    console.error(`ERROR: 画像はちょうど ${REQUIRED_COUNT} 枚必要です。検出: ${files.length} 枚`);
    if (files.length > 0) {
      console.error("検出したファイル:");
      files.forEach((f) => console.error("  -", path.basename(f)));
    } else {
      console.error("_incoming/paradog/earnings_background に画像を 16 枚入れてから再度実行してください。");
    }
    process.exit(1);
  }

  const sorted = sortImageFiles(files);

  for (let i = 0; i < sorted.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    const outName = `earnings_background_${num}.png`;
    const outPath = path.join(OUT_DIR, outName);
    const buf = fs.readFileSync(sorted[i]);
    await sharp(buf).png().toFile(outPath);
  }

  console.log("検出した入力ファイル（並び順）:");
  sorted.forEach((f, i) => console.log(`  ${i + 1}. ${path.basename(f)}`));
  console.log("\n出力先 public/paradog/earnings_bg に 16 枚の PNG を生成しました。");
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
