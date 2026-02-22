#!/usr/bin/env node
/**
 * KARP ギャラリー用画像を _incoming/paradog/alex_karp から検出し、
 * public/karp/ に karp-001.jpg ... karp-N.jpg として配置する。
 * 同時に lib/karpImages.generated.ts を生成する（枚数は検出した数だけ）。
 * 入力が png/webp/jpg/jpeg のどれでも、出力は常に JPG に統一（sharp で変換）。
 * 並び順はファイル名の自然順。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ALLOWED_EXT = [".png", ".webp", ".jpg", ".jpeg"];
const INCOMING_DIR = path.join(ROOT, "_incoming", "paradog", "alex_karp");
const OUT_DIR = path.join(ROOT, "public", "karp");
const GENERATED_PATH = path.join(ROOT, "lib", "karpImages.generated.ts");

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

function generateKarpImagesTs(count) {
  const lines = [
    "/** KARP ギャラリー画像リスト（prepare-karp-gallery.mjs 実行で上書き） */",
    "export const KARP_IMAGES = [",
    ...Array.from({ length: count }, (_, i) => {
      const num = String(i + 1).padStart(3, "0");
      return `  { id: "${i + 1}", src: "/karp/karp-${num}.jpg", alt: "Alex Karp photo ${num}" },`;
    }),
    "];",
  ];
  return lines.join("\n") + "\n";
}

async function main() {
  ensureDir(OUT_DIR);

  if (!fs.existsSync(INCOMING_DIR)) {
    console.error("ERROR: _incoming/paradog/alex_karp が存在しません。");
    process.exit(1);
  }

  const entries = fs.readdirSync(INCOMING_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && isImage(e.name))
    .map((e) => path.join(INCOMING_DIR, e.name));

  if (files.length === 0) {
    console.error("ERROR: 画像が 1 枚も検出されませんでした。");
    process.exit(1);
  }

  const sorted = sortImageFiles(files);

  for (let i = 0; i < sorted.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    const outName = `karp-${num}.jpg`;
    const outPath = path.join(OUT_DIR, outName);
    const buf = fs.readFileSync(sorted[i]);
    await sharp(buf).jpeg().toFile(outPath);
  }

  fs.writeFileSync(GENERATED_PATH, generateKarpImagesTs(sorted.length), "utf8");

  console.log("検出した入力ファイル（並び順）:");
  sorted.forEach((f, i) => console.log(`  ${i + 1}. ${path.basename(f)}`));
  console.log(`\n出力先 public/karp に ${sorted.length} 枚の JPG を生成しました。`);
  console.log(`lib/karpImages.generated.ts を ${sorted.length} 件で更新しました。`);
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
