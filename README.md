# ぱらどっぐ × Palantir（非公式ファンサイト）

unofficial fan site — Next.js App Router + Tailwind + GSAP（rapstaz風スクロールカード）

## 技術スタック

- Next.js（App Router）
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で表示。

## 画像（16枚）の差し替え（Finder 不要）

1. **`_incoming/paradog/`** に画像を16枚入れる（ドラッグ＆ドロップでOK）。  
   ファイル名は任意（例: image.png, image1.png … image15.png や 01.png … 16.png）。
2. 次を実行する:
   ```bash
   npm run prepare:paradog
   ```
3. `public/images/paradog/fv/` に **paradog-fv-01.png … paradog-fv-16.png** が常に PNG で生成され、入力ファイルは `_incoming/paradog/_done` に退避されます。
4. 参照は **`lib/paradogImages.ts`** に集約されています（.png 固定・編集不要）。

- **推奨フォーマット**: 入力は `.png` / `.webp` / `.jpg` / `.jpeg` のいずれか。出力は常に **PNG に統一**（sharp で変換）されるため参照切れは起きません。
- **NG例**: 16枚以外（15枚や17枚）、許可拡張子以外（.gif のみ・.bmp・.tiff 等）、`_done` 内のファイルをカウント対象にしたい（スクリプトは `_incoming/paradog` 直下の画像のみ検出）。
- 並び順: `image.png` → 01、`image1.png`～`image15.png` → 02～16。それ以外は自然順。
- 初回や `_incoming` が空のときは、`node scripts/seed-paradog-fv.mjs` で fv 用の最小プレースホルダー16枚を生成できます。

## ページ構成

- `/` — TOP（各ページへの導線カード）
- `/earnings` — 決算
- `/contracts` — 契約・提携
- `/price` — 株価
- `/about` — このサイトについて（unofficial fan site 明記）

## 主なコンポーネント

- `components/Header.tsx` — 固定ヘッダー（スクロール方向で表示制御）
- `components/Hero.tsx` — FV（100vh fixed、16枚配置）
- `components/ParadogCluster.tsx` — 16枚の座標・スケール・重なり順
- `components/ScrollSections.tsx` — セクションの器
- `components/RotatingCard.tsx` — rapstaz風回転カード（ScrollTrigger）
- `components/LoadingGate.tsx` — 初回のみローディング（sessionStorage）

セクション定義は **`lib/sections.ts`** でページごとに差し替え可能です。

## ビルド・デプロイ

```bash
npm run build
npm start
```

Vercel 想定。静的配信（SSG）です。
