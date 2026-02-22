import Header from "@/components/Header";
import LoadingGate from "@/components/LoadingGate";

/**
 * 共通レイアウト: ヘッダー(z-50) + 本文エリア
 * 本文は常にヘッダー下から表示され、min-h-screen で潰れを防ぐ
 */
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingGate>
      <Header />
      <div className="relative min-h-screen" style={{ zIndex: 1 }}>
        {children}
      </div>
    </LoadingGate>
  );
}
