import { NextRequest, NextResponse } from "next/server";

export type QuoteResponse = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  /** 前日終値 */
  prevClose?: number;
  /** 取得時点の Unix 時刻（ミリ秒）。As of / マーケット状態判定に利用 */
  asOfTimestamp: number;
};

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; pala_web/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Yahoo chart API returned ${res.status}`);
    }

    const data = await res.json();

    const result = data?.chart?.result?.[0];
    if (!result?.meta) {
      throw new Error("Invalid chart response");
    }

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? meta.previousClose ?? 0;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - previousClose;
    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;
    const currency = meta.currency ?? "USD";
    const asOfTimestamp =
      typeof meta.regularMarketTime === "number"
        ? meta.regularMarketTime * 1000
        : Date.now();

    const body: QuoteResponse = {
      symbol: meta.symbol ?? symbol,
      price,
      change,
      changePercent,
      currency,
      prevClose: previousClose,
      asOfTimestamp,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[api/quote]", err);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
