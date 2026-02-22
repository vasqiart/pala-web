import { NextRequest, NextResponse } from "next/server";
import { formatEtIso } from "@/lib/marketHours";

export type PriceResponse = {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  asOfET: string;
};

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
    });
    if (!res.ok) throw new Error(`Yahoo ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result?.meta) throw new Error("Invalid chart response");
    const meta = result.meta;
    const price = meta.regularMarketPrice ?? meta.previousClose ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose !== 0 ? (change / prevClose) * 100 : 0;
    const asOfTimestamp =
      typeof meta.regularMarketTime === "number"
        ? meta.regularMarketTime * 1000
        : Date.now();
    const body: PriceResponse = {
      symbol: meta.symbol ?? symbol,
      price,
      change,
      changePct,
      prevClose,
      asOfET: formatEtIso(new Date(asOfTimestamp)),
    };
    return NextResponse.json(body);
  } catch (err) {
    console.error("[api/price]", err);
    return NextResponse.json(
      {
        symbol,
        price: 0,
        change: 0,
        changePct: 0,
        prevClose: 0,
        asOfET: formatEtIso(new Date()),
      } satisfies PriceResponse,
      { status: 200 }
    );
  }
}
