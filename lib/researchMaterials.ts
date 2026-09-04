export const RESEARCH_CATEGORIES = [
  "ALL",
  "FINANCIALS",
  "TECHNOLOGY",
  "STRATEGY",
  "KARP",
] as const;

export type ResearchCategory = Exclude<
  (typeof RESEARCH_CATEGORIES)[number],
  "ALL"
>;

export type ResearchImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type ResearchMaterial = {
  slug: string;
  date: string;
  displayDate: string;
  title: string;
  summary: string;
  categories: ResearchCategory[];
  images: ResearchImage[];
};

export const RESEARCH_MATERIALS: ResearchMaterial[] = [
  {
    slug: "2026-08-21-security-forge",
    date: "2026-08-21",
    displayDate: "2026.08.21",
    title: "AIの速度でソフトウェアを守る",
    summary: "Security Forgeとは？",
    categories: ["TECHNOLOGY"],
    images: [
      {
        src: "/research/2026-08-21-security-forge/01.jpg",
        width: 1179,
        height: 1754,
        alt: "AIの速度でソフトウェアを守る",
      },
      {
        src: "/research/2026-08-21-security-forge/02.jpg",
        width: 1179,
        height: 1754,
        alt: "Security Forgeとは？",
      },
    ],
  },
  {
    slug: "2026-08-19-sovereignty-bootcamp",
    date: "2026-08-19",
    displayDate: "2026.08.19",
    title: "30日足らずで2回目のSovereignty Bootcampを開催",
    summary: "AI主権への需要が加速",
    categories: ["STRATEGY"],
    images: [
      {
        src: "/research/2026-08-19-sovereignty-bootcamp/01.jpg",
        width: 1179,
        height: 1757,
        alt: "30日足らずで2回目のSovereignty Bootcampを開催",
      },
    ],
  },
  {
    slug: "2026-08-03-q2-2026-cash-flow",
    date: "2026-08-03",
    displayDate: "2026.08.03",
    title: "圧倒的なキャッシュ創出力と盤石な財務基盤",
    summary: "Q2 2026 決算ハイライト",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-08-03-q2-2026-cash-flow/01.jpg",
        width: 1179,
        height: 1760,
        alt: "Q2 2026 圧倒的なキャッシュ創出力と盤石な財務基盤",
      },
    ],
  },
  {
    slug: "2026-07-29-quarterly-net-income",
    date: "2026-07-29",
    displayDate: "2026.07.29",
    title: "四半期純利益（損失）の推移",
    summary: "上場した四半期からQ1 2026まで",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-07-29-quarterly-net-income/01.jpg",
        width: 1179,
        height: 655,
        alt: "Palantir 四半期純利益と損失の推移",
      },
    ],
  },
  {
    slug: "2026-07-24-analyst-price-targets",
    date: "2026-07-24",
    displayDate: "2026.07.24",
    title: "アナリスト目標株価",
    summary: "2026年6月から7月の公表分",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-07-24-analyst-price-targets/01.jpg",
        width: 1179,
        height: 1761,
        alt: "Palantir アナリスト目標株価",
      },
    ],
  },
  {
    slug: "2026-07-16-quarterly-revenue",
    date: "2026-07-16",
    displayDate: "2026.07.16",
    title: "四半期売上高の推移",
    summary: "上場した四半期からQ1 2026まで",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-07-16-quarterly-revenue/01.jpg",
        width: 2048,
        height: 1167,
        alt: "Palantir 四半期売上高の推移",
      },
    ],
  },
  {
    slug: "2026-07-12-partnerships",
    date: "2026-07-12",
    displayDate: "2026.07.12",
    title: "Palantir Partnerships 14件",
    summary: "新規・戦略的協業と既存提携の拡大",
    categories: ["STRATEGY"],
    images: [
      {
        src: "/research/2026-07-12-partnerships/01.jpg",
        width: 946,
        height: 1663,
        alt: "Palantir Partnerships 14件",
      },
    ],
  },
  {
    slug: "2026-07-01-karp-data-protection",
    date: "2026-07-01",
    displayDate: "2026.07.01",
    title: "AI時代のデータ保護と欧州の技術競争力",
    summary: "Alex Karpの発言を4枚で読み解く",
    categories: ["KARP", "TECHNOLOGY"],
    images: [
      {
        src: "/research/2026-07-01-karp-data-protection/01.jpg",
        width: 1672,
        height: 941,
        alt: "Karpの発言の核心",
      },
      {
        src: "/research/2026-07-01-karp-data-protection/02.jpg",
        width: 1672,
        height: 941,
        alt: "なぜアプリケーション層が重要なのか",
      },
      {
        src: "/research/2026-07-01-karp-data-protection/03.jpg",
        width: 1672,
        height: 941,
        alt: "Karpが本当に伝えたいこと",
      },
      {
        src: "/research/2026-07-01-karp-data-protection/04.jpg",
        width: 1672,
        height: 941,
        alt: "Karpの発言をどう受け止めるべきか",
      },
    ],
  },
  {
    slug: "2026-06-29-sovereign-ai-os",
    date: "2026-06-29",
    displayDate: "2026.06.29",
    title: "なぜ今、Sovereign AI OSなのか？",
    summary: "主権を守りながらAIを動かす仕組み",
    categories: ["TECHNOLOGY", "STRATEGY"],
    images: [
      {
        src: "/research/2026-06-29-sovereign-ai-os/01.jpg",
        width: 1179,
        height: 635,
        alt: "なぜ今、Sovereign AI OSなのか",
      },
      {
        src: "/research/2026-06-29-sovereign-ai-os/02.jpg",
        width: 1179,
        height: 635,
        alt: "Sovereign AI OSとは",
      },
      {
        src: "/research/2026-06-29-sovereign-ai-os/03.jpg",
        width: 1179,
        height: 635,
        alt: "PalantirとNVIDIAは何を担うのか",
      },
      {
        src: "/research/2026-06-29-sovereign-ai-os/04.jpg",
        width: 1179,
        height: 635,
        alt: "Sovereign AI OSで何がうれしいのか",
      },
    ],
  },
  {
    slug: "2026-05-04-revenue-and-sbc",
    date: "2026-05-04",
    displayDate: "2026.05.04",
    title: "売上は5.1倍、SBC比率は75.1%から12.3%へ",
    summary: "株式報酬の推移",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-05-04-revenue-and-sbc/01.jpg",
        width: 1600,
        height: 900,
        alt: "売上と株式報酬比率の推移",
      },
    ],
  },
  {
    slug: "2026-05-04-q1-2026-highlights",
    date: "2026-05-04",
    displayDate: "2026.05.04",
    title: "Palantir Q1 2026",
    summary: "Q1決算で見る6つの重要指標",
    categories: ["FINANCIALS"],
    images: [
      {
        src: "/research/2026-05-04-q1-2026-highlights/01.jpg",
        width: 1004,
        height: 1567,
        alt: "Palantir Q1 2026の6つの重要指標",
      },
    ],
  },
  {
    slug: "2025-09-03-titan-system",
    date: "2025-09-03",
    displayDate: "2025.09.03",
    title: "米陸軍に最新AI地上局TITANシステム8基を納入へ",
    summary: "次世代の深層センシング能力を支える",
    categories: ["TECHNOLOGY", "STRATEGY"],
    images: [
      {
        src: "/research/2025-09-03-titan-system/01.jpg",
        width: 1179,
        height: 1751,
        alt: "米陸軍にTITANシステム8基を納入へ",
      },
    ],
  },
];
