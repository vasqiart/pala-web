/**
 * NYSE 市場時間・祝日判定（ET 基準）
 */

import nyseHolidaysJson from "@/data/nyse-holidays.json";

const NYSE_HOLIDAYS = new Set(nyseHolidaysJson as string[]);
const TZ_ET = "America/New_York";

/** 指定時刻を ET の日付文字列 YYYY-MM-DD に変換 */
export function toEtDateString(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TZ_ET });
}

/** 指定時刻の ET における曜日 (0=Sun .. 6=Sat) */
export function getEtDay(d: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_ET,
    weekday: "short",
  }).formatToParts(d);
  const w = parts.find((p) => p.type === "weekday")?.value ?? "";
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[w] ?? 0;
}

/** ET で土日か */
export function isWeekendET(d: Date): boolean {
  const day = getEtDay(d);
  return day === 0 || day === 6;
}

/** ET の日付（YYYY-MM-DD）が NYSE 祝日か */
export function isNyseHolidayET(d: Date): boolean {
  const dateStr = toEtDateString(d);
  return NYSE_HOLIDAYS.has(dateStr);
}

/** ET での YYYY-MM-DD HH:mm (ET) 形式 */
export function formatEtIso(d: Date): string {
  const s = d.toLocaleString("sv-SE", {
    timeZone: TZ_ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${s.slice(0, 16)} (ET)`;
}

/** ET での時・分を取得（0-23, 0-59） */
function getEtHourMin(d: Date): { hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_ET,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  let hour = 0;
  let minute = 0;
  for (const p of parts) {
    if (p.type === "hour") hour = parseInt(p.value, 10);
    if (p.type === "minute") minute = parseInt(p.value, 10);
  }
  return { hour, minute };
}

export type NyseMarketStateResult = {
  market: "Open" | "Closed";
  session: "Regular" | "Pre-Market" | "After Hours" | "Closed";
  nowEtIso: string;
  reason?: "Weekend" | "Holiday" | "OutsideHours";
};

/**
 * 指定時刻（UTC またはローカル）に対する NYSE 市場状態を返す。
 * 判定はすべて ET 基準。祝日は日付（YYYY-MM-DD）のみで判定。
 */
export function getNyseMarketState(nowUtcOrNow: Date): NyseMarketStateResult {
  const d = nowUtcOrNow;
  const nowEtIso = formatEtIso(d);

  if (isWeekendET(d)) {
    return {
      market: "Closed",
      session: "Closed",
      nowEtIso,
      reason: "Weekend",
    };
  }
  if (isNyseHolidayET(d)) {
    return {
      market: "Closed",
      session: "Closed",
      nowEtIso,
      reason: "Holiday",
    };
  }

  const { hour, minute } = getEtHourMin(d);
  const mins = hour * 60 + minute;

  if (mins >= 4 * 60 && mins < 9 * 60 + 30) {
    return {
      market: "Closed",
      session: "Pre-Market",
      nowEtIso,
      reason: "OutsideHours",
    };
  }
  if (mins >= 9 * 60 + 30 && mins < 16 * 60) {
    return {
      market: "Open",
      session: "Regular",
      nowEtIso,
    };
  }
  if (mins >= 16 * 60 && mins < 20 * 60) {
    return {
      market: "Closed",
      session: "After Hours",
      nowEtIso,
      reason: "OutsideHours",
    };
  }
  return {
    market: "Closed",
    session: "Closed",
    nowEtIso,
    reason: "OutsideHours",
  };
}
