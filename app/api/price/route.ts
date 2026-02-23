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

const TIMEOUT_MS = 6000;

function zeroPriceResponse(symbol: string): NextResponse {
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

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
      cache: "no-store",
    });
    clearTimeout(to);
    if (!res.ok) throw new Error(`Yahoo ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result?.meta) throw new Error("Invalid chart response");
    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close as unknown;
    const isValidNum = (v: unknown): v is number =>
      typeof v === "number" && Number.isFinite(v);
    let price: number;
    let prevClose: number;
    if (
      Array.isArray(closes) &&
      closes.length >= 2 &&
      isValidNum(closes[closes.length - 1]) &&
      isValidNum(closes[closes.length - 2]) &&
      (closes[closes.length - 1] as number) > 0
    ) {
      price = closes[closes.length - 1] as number;
      prevClose = closes[closes.length - 2] as number;
    } else {
      price = meta.regularMarketPrice ?? meta.previousClose ?? 0;
      prevClose = meta.previousClose ?? price;
    }
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
    clearTimeout(to);
    if (err instanceof Error && err.name === "AbortError") {
      return zeroPriceResponse(symbol);
    }
    console.error("[api/price]", err);
    return zeroPriceResponse(symbol);
  }
}
