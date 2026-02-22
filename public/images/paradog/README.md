# ぱらどっぐ画像

## FV用（16枚）

- **配置先**: `fv/` — ファイル名は **paradog-fv-01.png … paradog-fv-16.png**（常に PNG）
- **差し替え**: プロジェクト直下で `npm run prepare:paradog` を実行（`_incoming/paradog` に16枚入れてから）。入力が webp/jpg でも出力は PNG に変換されます。

### 推奨フォーマット

- **入力**: `.png` / `.webp` / `.jpg` / `.jpeg` のいずれか、ちょうど16枚を `_incoming/paradog` に配置。
- **出力**: 常に PNG（`lib/paradogImages.ts` は .png 固定参照のため、変換により参照切れが起きません）。

### NG例

- 16枚以外（15枚・17枚など）→ スクリプトがエラーで停止。
- 許可拡張子以外（.gif のみ・.bmp・.tiff 等）→ 検出対象外になり「16枚ない」とエラーになる可能性。
- `_incoming/paradog/_done` に退避したファイルは次回の検出対象に含まれない（直下の画像のみカウント）。

## その他

- `cards/` — カード周辺用（必要に応じて利用）
- `ui/` — UI用（必要に応じて利用）
