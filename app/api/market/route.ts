import { NextResponse } from "next/server";
import { getNyseMarketState } from "@/lib/marketHours";

export type MarketResponse = {
  isOpen: boolean;
  session: "regular" | "closed" | "pre" | "post";
  asOfET: string;
  nextOpenET?: string;
  reason?: string;
};

export async function GET() {
  const now = new Date();
  const state = getNyseMarketState(now);
  const session: MarketResponse["session"] =
    state.session === "Regular"
      ? "regular"
      : state.session === "Pre-Market"
        ? "pre"
        : state.session === "After Hours"
          ? "post"
          : "closed";

  const body: MarketResponse = {
    isOpen: state.market === "Open",
    session,
    asOfET: state.nowEtIso,
    reason: state.reason,
  };
  return NextResponse.json(body);
}
