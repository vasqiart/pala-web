#!/usr/bin/env node
/**
 * ぱらどっぐ画像16枚を _incoming/paradog から検出し、
 * public/images/paradog/fv/ に paradog-fv-01.png ... 16.png として配置する。
 * 入力が png/webp/jpg/jpeg のどれでも、出力は常に PNG に統一（sharp で変換）。
 * 並び順: image.png → 01, image1..image15 → 02..16, それ以外は自然順。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ALLOWED_EXT = [".png", ".webp", ".jpg", ".jpeg"];
const OUTPUT_EXT = ".png";
const INCOMING_DIR = path.join(ROOT, "_incoming", "paradog");
const DONE_DIR = path.join(INCOMING_DIR, "_done");
const FV_DIR = path.join(ROOT, "public", "images", "paradog", "fv");
const REQUIRED_COUNT = 16;

/** FV用: 1024x1024 透過PNGに正規化（contain + 中央配置 + 余白） */
const FV_CANVAS = 1024;
const FV_CONTENT = 900; // 内側 8% 程度余白
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

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
  const byBasename = (n) => path.basename(n, path.extname(n)).toLowerCase();

  const hasImage = names.some((n) => byBasename(n) === "image" && !/\d/.test(path.basename(n, path.extname(n))));
  const hasImage1to15 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].every((i) =>
    names.some((n) => byBasename(n) === `image${i}`)
  );

  if (hasImage && hasImage1to15) {
    const ordered = [];
    const byName = new Map(names.map((n) => [byBasename(n), n]));
    ordered.push(byName.get("image"));
    for (let i = 1; i <= 15; i++) {
      ordered.push(byName.get(`image${i}`));
    }
    return ordered.filter(Boolean);
  }

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
  ensureDir(path.join(ROOT, "public", "images", "paradog", "fv"));
  ensureDir(path.join(ROOT, "public", "images", "paradog", "cards"));
  ensureDir(path.join(ROOT, "public", "images", "paradog", "ui"));
  ensureDir(INCOMING_DIR);

  if (!fs.existsSync(INCOMING_DIR)) {
    console.error("ERROR: _incoming/paradog が存在しません。");
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
      console.error("_incoming/paradog に画像を16枚入れてから再度実行してください。");
    }
    process.exit(1);
  }

  const sorted = sortImageFiles(files);

  if (fs.existsSync(FV_DIR)) {
    const existing = fs.readdirSync(FV_DIR).filter((n) => n.startsWith("paradog-fv-"));
    existing.forEach((n) => fs.unlinkSync(path.join(FV_DIR, n)));
  }
  ensureDir(FV_DIR);

  ensureDir(DONE_DIR);
  const doneStamp = path.join(DONE_DIR, `.done_${Date.now()}`);

  const outputNames = [];
  for (let i = 0; i < sorted.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const outName = `paradog-fv-${num}${OUTPUT_EXT}`;
    const outPath = path.join(FV_DIR, outName);
    const buf = fs.readFileSync(sorted[i]);
    const resized = await sharp(buf)
      .resize(FV_CONTENT, FV_CONTENT, { fit: "inside", withoutEnlargement: true })
      .toBuffer();
    const meta = await sharp(resized).metadata();
    const w = meta.width || FV_CONTENT;
    const h = meta.height || FV_CONTENT;
    const padL = Math.floor((FV_CANVAS - w) / 2);
    const padR = FV_CANVAS - w - padL;
    const padT = Math.floor((FV_CANVAS - h) / 2);
    const padB = FV_CANVAS - h - padT;
    await sharp(resized)
      .extend({ top: padT, bottom: padB, left: padL, right: padR, background: TRANSPARENT })
      .png()
      .toFile(outPath);
    outputNames.push(outName);
  }

  sorted.forEach((src) => {
    const base = path.basename(src);
    const dest = path.join(DONE_DIR, base);
    let destPath = dest;
    let n = 0;
    while (fs.existsSync(destPath)) {
      destPath = path.join(DONE_DIR, path.basename(src, path.extname(src)) + `_${++n}` + path.extname(src));
    }
    fs.renameSync(src, destPath);
  });
  fs.writeFileSync(doneStamp, new Date().toISOString(), "utf8");

  console.log("検出した入力ファイル（並び順）:");
  sorted.forEach((f, i) => console.log(`  ${i + 1}. ${path.basename(f)}`));
  console.log("\n出力先 public/images/paradog/fv に生成されたファイル（1024x1024 透過PNG）:");
  outputNames.forEach((n) => console.log("  -", n));
  console.log("\n処理完了。入力ファイルは _incoming/paradog/_done に退避しました。");
}

main().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
