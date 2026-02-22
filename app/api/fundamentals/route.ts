import { NextRequest, NextResponse } from "next/server";

export type FundamentalsResponse = {
  symbol: string;
  price: number;
  sharesDiluted: number;
  revenueTTM: number;
  revenueNTM: number | null;
  epsTTM: number | null;
  epsNTM: number | null;
  fcfTTM: number | null;
  revenueTTM1yAgo: number | null;
  asOfET: string;
};

function formatEtNow(): string {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).slice(0, 16) + " (ET)";
}

const emptyBody = (symbol: string): FundamentalsResponse => ({
  symbol,
  price: 0,
  sharesDiluted: 0,
  revenueTTM: 0,
  revenueNTM: null,
  epsTTM: null,
  epsNTM: null,
  fcfTTM: null,
  revenueTTM1yAgo: null,
  asOfET: formatEtNow(),
});

async function yahooFallback(symbol: string): Promise<FundamentalsResponse> {
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics,summaryDetail,financialData`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pala_web/1.0)" },
    });
    if (!res.ok) return emptyBody(symbol);
    const data = await res.json();
    const result = data?.quoteSummary?.result?.[0];
    if (!result) return emptyBody(symbol);
    const stats = result.defaultKeyStatistics ?? {};
    const summary = result.summaryDetail ?? {};
    const financial = result.financialData ?? {};
    const shares =
      stats.sharesOutstanding ?? stats.floatShares ?? 0;
    const marketCap = summary.marketCap ?? 0;
    const price = summary.regularMarketPrice ?? (shares > 0 ? marketCap / shares : 0);
    const trailingPE = summary.trailingPE;
    const epsTTM =
      trailingPE != null && trailingPE > 0 && price > 0 ? price / trailingPE : null;
    const revenueTTM = financial.totalRevenue ?? 0;
    return {
      symbol,
      price,
      sharesDiluted: shares,
      revenueTTM,
      revenueNTM: null,
      epsTTM,
      epsNTM: null,
      fcfTTM: financial.freeCashflow ?? null,
      revenueTTM1yAgo: null,
      asOfET: formatEtNow(),
    };
  } catch {
    return emptyBody(symbol);
  }
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "PLTR";
  const fmpKey = process.env.FMP_API_KEY ?? process.env.FMP_KEY;

  if (fmpKey) {
    try {
      const [metricsRes, quoteRes, incomeRes, estimatesRes] = await Promise.all([
        fetch(
          `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${fmpKey}`
        ),
        fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${fmpKey}`),
        fetch(
          `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=8&apikey=${fmpKey}`
        ),
        fetch(
          `https://financialmodelingprep.com/api/v3/analyst-estimates/${symbol}?limit=1&apikey=${fmpKey}`
        ),
      ]);

      const metrics = metricsRes.ok ? await metricsRes.json() : [];
      const ttm = Array.isArray(metrics) ? metrics[0] : metrics;
      const quoteData = quoteRes.ok ? await quoteRes.json() : [];
      const price = Array.isArray(quoteData) && quoteData[0] ? quoteData[0].price : 0;
      const shares = ttm?.weightedAvgShsOutDil ?? ttm?.numberOfShares ?? 0;
      const revenuePerShare = ttm?.revenuePerShareTTM;
      const revenueTTM =
        revenuePerShare != null && shares > 0 ? revenuePerShare * shares : 0;
      const epsTTM =
        ttm?.peRatioTTM != null && price > 0 ? price / ttm.peRatioTTM : null;
      const fcfTTM =
        ttm?.freeCashFlowPerShareTTM != null && shares > 0
          ? ttm.freeCashFlowPerShareTTM * shares
          : null;

      let revenueTTM1yAgo: number | null = null;
      if (incomeRes.ok) {
        const income = await incomeRes.json();
        if (Array.isArray(income) && income.length >= 8) {
          revenueTTM1yAgo = income
            .slice(4, 8)
            .reduce((s: number, q: { revenue?: number }) => s + (q.revenue ?? 0), 0);
        }
      }

      let revenueNTM: number | null = null;
      let epsNTM: number | null = null;
      if (estimatesRes.ok) {
        const est = await estimatesRes.json();
        const row = Array.isArray(est) ? est[0] : est;
        if (row?.estimatedRevenueAvg != null) revenueNTM = row.estimatedRevenueAvg;
        if (row?.estimatedEpsAvg != null) epsNTM = row.estimatedEpsAvg;
      }

      return NextResponse.json({
        symbol,
        price,
        sharesDiluted: shares,
        revenueTTM,
        revenueNTM,
        epsTTM,
        epsNTM,
        fcfTTM,
        revenueTTM1yAgo,
        asOfET: formatEtNow(),
      } satisfies FundamentalsResponse);
    } catch {
      return NextResponse.json(await yahooFallback(symbol));
    }
  }

  return NextResponse.json(await yahooFallback(symbol));
}
