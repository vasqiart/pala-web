import { NextRequest, NextResponse } from "next/server";

export type OhlcResponse = {
  symbol: string;
  timeframe: "1D";
  candles: Array<{ t: number; o: number; h: number; l: number; c: number }>;
  /** Present when candles are empty so the front can show a message */
  error?: string;
};

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
    });
    if (!res.ok) throw new Error(`Yahoo ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result?.timestamp?.length) {
      return NextResponse.json({
        symbol,
        timeframe: "1D" as const,
        candles: [],
        error: "No timestamp data in response",
      } satisfies OhlcResponse);
    }
    const timestamps = result.timestamp as number[];
    const quote = result.indicators?.quote?.[0];
    const o = (quote?.open ?? []) as number[];
    const h = (quote?.high ?? []) as number[];
    const l = (quote?.low ?? []) as number[];
    const c = (quote?.close ?? []) as number[];
    const candles = timestamps.map((t, i) => ({
      t: t * 1000,
      o: o[i] ?? c[i] ?? 0,
      h: h[i] ?? c[i] ?? 0,
      l: l[i] ?? c[i] ?? 0,
      c: c[i] ?? 0,
    }));
    const body: OhlcResponse = { symbol: result.meta?.symbol ?? symbol, timeframe: "1D", candles };
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch OHLC";
    return NextResponse.json(
      { symbol, timeframe: "1D" as const, candles: [], error: message } satisfies OhlcResponse,
      { status: 200 }
    );
  }
}
