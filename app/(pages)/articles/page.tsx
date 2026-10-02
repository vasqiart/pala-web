import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "ARTICLES | ぱらどっぐ × Palantir",
  description: "Palantirを知るための解説記事。",
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-16 pt-16">
      <PageHeading title="ARTICLES" subtitle="Insights & Perspectives" />
      <div className="mx-auto mt-24 max-w-2xl rounded-[2rem] bg-white px-8 py-16 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        <p className="text-xs tracking-[0.14em] text-gray-400">COMING SOON</p>
        <h2 className="mt-4 text-lg font-medium text-gray-800">パランティアを、もう少し深く。</h2>
        <p className="mt-3 text-sm leading-7 text-gray-500">解説記事は、ただいま準備中です。</p>
      </div>
    </main>
  );
}
