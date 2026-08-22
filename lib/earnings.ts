import { HISTORICAL_EARNINGS_QUARTERS } from "@/lib/earnings-history";

export type FinancialHighlight = {
  text: string;
  emphasis?: string[];
  muted?: string[];
};

export type GuidanceSnapshot = {
  title: string;
  items: FinancialHighlight[];
  archiveSummary: string;
};

export type EarningsQuarter = {
  id: string;
  quarter: string;
  fiscalYear: number;
  periodEnded: string;
  reportedAt: string;
  earnings: FinancialHighlight[];
  earningsArchiveSummary: string;
  guidance: GuidanceSnapshot;
  sourceUrl: string;
};

/**
 * 四半期データは新しい順に追加する。
 * 先頭が Snapshot、それ以降が Archive として自動表示される。
 */
export const EARNINGS_QUARTERS: EarningsQuarter[] = [
  {
    id: "q2-fy2026",
    quarter: "Q2 FY2026",
    fiscalYear: 2026,
    periodEnded: "Quarter ended June 30, 2026",
    reportedAt: "Reported August 3, 2026",
    earningsArchiveSummary: "Revenue $1.94B · +93% YoY · Rule of 40 155%",
    sourceUrl:
      "https://investors.palantir.com/news-details/2026/Palantir-Reports-Q2-2026-U-S--Comm-Revenue-Growth-of-149-YY-and-Revenue-Growth-of-93-YY-Raises-FY-2026-Revenue-Guidance-to-82-YY-Growth-and-U-S--Comm-Revenue-Guidance-to-134-YY-Crushing-Consensus-Expectations/",
    earnings: [
      {
        text: "US revenueは前年同期比 +115%、前四半期比 +23%増の $1.57 billionに拡大しました。",
        emphasis: ["$1.57 billion"],
        muted: ["+115%", "+23%"],
      },
      {
        text: "US commercial revenueは前年同期比 +149%、前四半期比 +28%増の $764 millionに拡大しました。",
        emphasis: ["$764 million"],
        muted: ["+149%", "+28%"],
      },
      {
        text: "US government revenueは前年同期比 +90%、前四半期比 +18%増の $809 millionに拡大しました。",
        emphasis: ["$809 million"],
        muted: ["+90%", "+18%"],
      },
      {
        text: "売上は前年同期比 +93%、前四半期比 +19%増の $1.94 billionに拡大しました。",
        emphasis: ["$1.94 billion"],
        muted: ["+93%", "+19%"],
      },
      {
        text: "Rule of 40スコアは155%でした。",
        emphasis: ["155%"],
      },
      {
        text: "$1 million以上の案件を220件、$5 million以上を98件、$10 million以上を73件クローズしました。",
        emphasis: ["$1 million", "$5 million", "$10 million", "220件", "98件", "73件"],
      },
      {
        text: "Adjusted free cash flowは$1.22 billion、マージンは63%でした。",
        emphasis: ["$1.22 billion"],
        muted: ["63%"],
      },
      {
        text: "Adjusted operating incomeは$1.19 billion、マージンは62%でした。",
        emphasis: ["$1.19 billion"],
        muted: ["62%"],
      },
      {
        text: "US commercial remaining deal value（RDV）は前年同期比 +124%、前四半期比 +27%増の$6.24 billionに拡大しました。",
        emphasis: ["$6.24 billion"],
        muted: ["+124%", "+27%"],
      },
      {
        text: "US commercial total contract value（TCV）は過去最高の$2.13 billion、前年同期比 +153%でした。",
        emphasis: ["$2.13 billion"],
        muted: ["+153%"],
      },
      {
        text: "Overall TCVは前年同期比 +49%増の$3.37 billionでした。",
        emphasis: ["$3.37 billion"],
        muted: ["+49%"],
      },
      {
        text: "Adjusted EPSは$0.41、GAAP EPSも$0.41でした。",
        emphasis: ["$0.41"],
      },
    ],
    guidance: {
      title: "Outlook for Q3 & FY2026",
      archiveSummary: "Q3 revenue $2.160–$2.164B · FY revenue $8.150–$8.158B",
      items: [
        {
          text: "Q3 2026 revenueは$2.160–$2.164 billionを見込んでいます。",
          emphasis: ["$2.160–$2.164 billion"],
        },
        {
          text: "Q3 2026 adjusted operating incomeは$1.292–$1.296 billionを見込んでいます。",
          emphasis: ["$1.292–$1.296 billion"],
        },
        {
          text: "FY2026 revenueは$8.150–$8.158 billionを見込んでいます。",
          emphasis: ["$8.150–$8.158 billion"],
        },
        {
          text: "FY2026 US commercial revenueは$3.424 billion超、少なくとも前年比 +134%を見込んでいます。",
          emphasis: ["$3.424 billion超"],
          muted: ["+134%"],
        },
        {
          text: "FY2026 adjusted operating incomeは$4.889–$4.897 billionを見込んでいます。",
          emphasis: ["$4.889–$4.897 billion"],
        },
        {
          text: "FY2026 adjusted free cash flowは$4.5–$4.7 billionを見込んでいます。",
          emphasis: ["$4.5–$4.7 billion"],
        },
        {
          text: "2026年の各四半期で、GAAP operating incomeとnet incomeの黒字を見込んでいます。",
          emphasis: ["GAAP operating income", "net income"],
        },
      ],
    },
  },
  {
    id: "q1-fy2026",
    quarter: "Q1 FY2026",
    fiscalYear: 2026,
    periodEnded: "Quarter ended March 31, 2026",
    reportedAt: "Reported May 4, 2026",
    earningsArchiveSummary: "Revenue $1.63B · +85% YoY · Rule of 40 145%",
    sourceUrl:
      "https://investors.palantir.com/news-details/2026/Palantir-Reports-Q1-2026-U-S--Revenue-Growth-of-104-YY-and-Revenue-Growth-of-85-YY-Raises-FY-2026-Revenue-Guidance-to-71-YY-Growth-and-U-S--Comm-Revenue-Guidance-to-120-YY-Crushing-Consensus-Expectations/",
    earnings: [
      { text: "US revenueは前年同期比 +104%、前四半期比 +19%増の$1.28 billionに拡大しました。", emphasis: ["$1.28 billion"], muted: ["+104%", "+19%"] },
      { text: "US commercial revenueは前年同期比 +133%、前四半期比 +18%増の$595 millionに拡大しました。", emphasis: ["$595 million"], muted: ["+133%", "+18%"] },
      { text: "US government revenueは前年同期比 +84%、前四半期比 +21%増の$687 millionに拡大しました。", emphasis: ["$687 million"], muted: ["+84%", "+21%"] },
      { text: "売上は前年同期比 +85%、前四半期比 +16%増の$1.63 billionに拡大しました。", emphasis: ["$1.63 billion"], muted: ["+85%", "+16%"] },
      { text: "Rule of 40スコアは145%でした。", emphasis: ["145%"] },
      { text: "$1 million以上の案件を206件、$5 million以上を72件、$10 million以上を47件クローズしました。", emphasis: ["$1 million", "$5 million", "$10 million", "206件", "72件", "47件"] },
      { text: "Adjusted free cash flowは$925 million、マージンは57%でした。", emphasis: ["$925 million"], muted: ["57%"] },
      { text: "Adjusted operating incomeは$984 million、マージンは60%でした。", emphasis: ["$984 million"], muted: ["60%"] },
      { text: "US commercial remaining deal value（RDV）は前年同期比 +112%、前四半期比 +12%増の$4.92 billionに拡大しました。", emphasis: ["$4.92 billion"], muted: ["+112%", "+12%"] },
      { text: "US commercial total contract value（TCV）は$1.18 billion、前年同期比 +45%でした。", emphasis: ["$1.18 billion"], muted: ["+45%"] },
      { text: "Overall TCVは前年同期比 +61%増の$2.41 billionでした。", emphasis: ["$2.41 billion"], muted: ["+61%"] },
      { text: "Adjusted EPSは$0.33、GAAP EPSは$0.34でした。", emphasis: ["$0.33", "$0.34"] },
    ],
    guidance: {
      title: "Outlook for Q2 & FY2026",
      archiveSummary: "Q2 revenue $1.797–$1.801B · FY revenue $7.650–$7.662B",
      items: [
        { text: "Q2 2026 revenueは$1.797–$1.801 billionを見込んでいました。", emphasis: ["$1.797–$1.801 billion"] },
        { text: "Q2 2026 adjusted operating incomeは$1.063–$1.067 billionを見込んでいました。", emphasis: ["$1.063–$1.067 billion"] },
        { text: "FY2026 revenueは$7.650–$7.662 billionを見込んでいました。", emphasis: ["$7.650–$7.662 billion"] },
        { text: "FY2026 US commercial revenueは$3.224 billion超、少なくとも前年比 +120%を見込んでいました。", emphasis: ["$3.224 billion超"], muted: ["+120%"] },
        { text: "FY2026 adjusted operating incomeは$4.440–$4.452 billionを見込んでいました。", emphasis: ["$4.440–$4.452 billion"] },
        { text: "FY2026 adjusted free cash flowは$4.2–$4.4 billionを見込んでいました。", emphasis: ["$4.2–$4.4 billion"] },
        { text: "2026年の各四半期で、GAAP operating incomeとnet incomeの黒字を見込んでいました。", emphasis: ["GAAP operating income", "net income"] },
      ],
    },
  },
  {
    id: "q4-fy2025",
    quarter: "Q4 FY2025",
    fiscalYear: 2025,
    periodEnded: "Quarter ended December 31, 2025",
    reportedAt: "Reported February 2, 2026",
    earningsArchiveSummary: "Revenue $1.41B · +70% YoY · Rule of 40 127%",
    sourceUrl:
      "https://investors.palantir.com/news-details/2026/Palantir-Reports-Q4-2025-U-S--Comm-Revenue-Growth-of-137-YY-and-Revenue-Growth-of-70-YY-Issues-FY-2026-Revenue-Guidance-of-61-YY-and-U-S--Comm-Revenue-Guidance-of-115-YY-Crushing-Consensus-Expectations/",
    earnings: [
      { text: "US revenueは前年同期比 +93%、前四半期比 +22%増の$1.08 billionに拡大しました。", emphasis: ["$1.08 billion"], muted: ["+93%", "+22%"] },
      { text: "US commercial revenueは前年同期比 +137%、前四半期比 +28%増の$507 millionに拡大しました。", emphasis: ["$507 million"], muted: ["+137%", "+28%"] },
      { text: "US government revenueは前年同期比 +66%、前四半期比 +17%増の$570 millionに拡大しました。", emphasis: ["$570 million"], muted: ["+66%", "+17%"] },
      { text: "売上は前年同期比 +70%、前四半期比 +19%増の$1.41 billionに拡大しました。Strategic Commercial Contractsを除くと、前年同期比 +72%、前四半期比 +19%でした。", emphasis: ["$1.41 billion"], muted: ["+70%", "+19%", "+72%"] },
      { text: "Rule of 40スコアは127%でした。", emphasis: ["127%"] },
      { text: "$1 million以上の案件を180件、$5 million以上を84件、$10 million以上を61件クローズしました。", emphasis: ["$1 million", "$5 million", "$10 million", "180件", "84件", "61件"] },
      { text: "Adjusted free cash flowは$791 million、マージンは56%でした。", emphasis: ["$791 million"], muted: ["56%"] },
      { text: "Adjusted operating incomeは$798 million、マージンは57%でした。", emphasis: ["$798 million"], muted: ["57%"] },
      { text: "US commercial remaining deal value（RDV）は前年同期比 +145%、前四半期比 +21%増の$4.38 billionに拡大しました。", emphasis: ["$4.38 billion"], muted: ["+145%", "+21%"] },
      { text: "US commercial total contract value（TCV）は過去最高の$1.34 billion、前年同期比 +67%でした。", emphasis: ["$1.34 billion"], muted: ["+67%"] },
      { text: "Overall TCVは過去最高の$4.26 billion、前年同期比 +138%でした。", emphasis: ["$4.26 billion"], muted: ["+138%"] },
      { text: "Adjusted EPSは$0.25、GAAP EPSは$0.24でした。", emphasis: ["$0.25", "$0.24"] },
    ],
    guidance: {
      title: "Outlook for Q1 & FY2026",
      archiveSummary: "Q1 revenue $1.532–$1.536B · FY revenue $7.182–$7.198B",
      items: [
        { text: "Q1 2026 revenueは$1.532–$1.536 billionを見込んでいました。", emphasis: ["$1.532–$1.536 billion"] },
        { text: "Q1 2026 adjusted operating incomeは$870–$874 millionを見込んでいました。", emphasis: ["$870–$874 million"] },
        { text: "FY2026 revenueは$7.182–$7.198 billionを見込んでいました。", emphasis: ["$7.182–$7.198 billion"] },
        { text: "FY2026 US commercial revenueは$3.144 billion超、少なくとも前年比 +115%を見込んでいました。", emphasis: ["$3.144 billion超"], muted: ["+115%"] },
        { text: "FY2026 adjusted operating incomeは$4.126–$4.142 billionを見込んでいました。", emphasis: ["$4.126–$4.142 billion"] },
        { text: "FY2026 adjusted free cash flowは$3.925–$4.125 billionを見込んでいました。", emphasis: ["$3.925–$4.125 billion"] },
        { text: "2026年の各四半期で、GAAP operating incomeとnet incomeの黒字を見込んでいました。", emphasis: ["GAAP operating income", "net income"] },
      ],
    },
  },
  ...HISTORICAL_EARNINGS_QUARTERS,
];

export const LATEST_EARNINGS = EARNINGS_QUARTERS[0];
export const EARNINGS_ARCHIVE = EARNINGS_QUARTERS.slice(1);
