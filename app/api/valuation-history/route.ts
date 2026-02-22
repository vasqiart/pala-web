import { NextRequest, NextResponse } from "next/server";

export type ValuationHistoryPoint = {
  t: number;
  marketCap: number;
  psTTM: number | null;
  peTTM: number | null;
  ruleOf40TTM: number | null;
};

export type ValuationHistoryResponse = {
  symbol: string;
  points: ValuationHistoryPoint[];
};

async function getYahooOhlc(symbol: string): Promise<Array<{ t: number; c: number }>> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result?.timestamp?.length) return [];
  const timestamps = result.timestamp as number[];
  const quote = result.indicators?.quote?.[0];
  const c = (quote?.close ?? []) as number[];
  return timestamps.map((t: number, i: number) => ({
    t: t * 1000,
    c: c[i] ?? 0,
  }));
}

async function getYahooShares(symbol: string): Promise<number> {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=defaultKeyStatistics`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  const result = data?.quoteSummary?.result?.[0];
  const stats = result?.defaultKeyStatistics ?? {};
  return stats.sharesOutstanding ?? stats.floatShares ?? 0;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";
  try {
    const [candles, shares] = await Promise.all([
      getYahooOhlc(symbol),
      getYahooShares(symbol),
    ]);
    const points: ValuationHistoryPoint[] = candles.map((c) => ({
      t: c.t,
      marketCap: shares > 0 ? c.c * shares : 0,
      psTTM: null,
      peTTM: null,
      ruleOf40TTM: null,
    }));
    return NextResponse.json({
      symbol,
      points,
    } satisfies ValuationHistoryResponse);
  } catch {
    return NextResponse.json(
      { symbol, points: [] } satisfies ValuationHistoryResponse,
      { status: 200 }
    );
  }
}
