import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";

export async function getStoryDecorations(folder: "decorations" | "reader-decorations"): Promise<string[]> {
  const directory = path.join(process.cwd(), "public", "images", "stories", folder);
  try {
    const files = await readdir(directory, { withFileTypes: true });
    return files
      .filter((file) => file.isFile() && /\.(png|jpe?g|webp|avif|gif)$/i.test(file.name))
      .map((file) => `/images/stories/${folder}/${encodeURIComponent(file.name)}`)
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
