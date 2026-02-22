import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/** プロジェクトルートからの相対パスで _incoming の画像を返す（絶対パスは使わない） */
export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "_incoming",
      "paradog",
      "top_card2",
      "top_card2.png"
    );

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[api/images/top-card2]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
