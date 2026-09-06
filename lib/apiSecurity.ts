import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_SYMBOL = "PLTR" as const;
const EXTERNAL_FETCH_TIMEOUT_MS = 6_000;

export function getSupportedSymbol(request: NextRequest): typeof SUPPORTED_SYMBOL | null {
  const requested = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const symbol = requested || SUPPORTED_SYMBOL;
  return symbol === SUPPORTED_SYMBOL ? SUPPORTED_SYMBOL : null;
}

export function unsupportedSymbolResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unsupported symbol" },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  );
}

export function externalFetchSignal(): AbortSignal {
  return AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS);
}
