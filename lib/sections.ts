/**
 * ページごとのセクション定義（タイトル・説明・CTA・回転角など）
 * 差し替え時はこの定義だけ編集。
 */

export type SectionLinkItem = {
  title: string;
  description: string;
  url: string;
  /** public/assets/logos からのパス（例: palantir.webp） */
  logo: string;
};

export type SectionItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** 初期回転角（deg）。-20 〜 -12 程度 */
  initialRotation: number;
  /** 内側コンテンツの逆方向回転（deg）。6 〜 12 程度 */
  innerRotation: number;
  /** リンク一覧（ある場合のみカード内に表示） */
  links?: SectionLinkItem[];
  /** カード右側に表示する画像（public からのパス。例: /assets/paradog/top/about-card.png） */
  cardImage?: string;
  /** カード右側に absolute で浮かせる装飾画像（Karp カード用。public パス） */
  cardDecorImage?: string;
  /** 本文行の右側に表示するロゴ＋リンク（例: Learn more カード） */
  inlineImage?: { src: string; href: string };
};

export type PageSections = SectionItem[];

const baseRotation = -16;
const innerRotation = 8;

/** TOP: 各ページへの導線カード（表示順はヘッダーと統一: ABOUT → PALANTIR → SHARE PRICE → EARNINGS → CONTRACTS → KARP） */
export const TOP_SECTIONS: PageSections = [
  {
    id: "about",
    title: "ABOUT",
    subtitle: "Start here",
    description: "「ぱらどっぐ × Palantir」がどんなサイト知りたい方はこちらへどうぞ。\nこのページを作った経緯や説明やスタンス、沢山発信してるからそのリンクとか置いてる。",
    ctaLabel: "ABOUT",
    ctaHref: "/about",
    initialRotation: baseRotation,
    innerRotation: innerRotation + 4,
    cardImage: "/assets/paradog/top/about-card.png",
  },
  {
    id: "company",
    title: "Palantir",
    subtitle: "Company Profile",
    description: "超個人的なPalantirの紹介はこちらから。\n\nいずれは経営陣の紹介や主要製品も紹介したい。",
    ctaLabel: "PALANTIR",
    ctaHref: "/company",
    initialRotation: baseRotation,
    innerRotation,
    cardImage: "/paradog/palantir_card_001.png",
  },
  {
    id: "price",
    title: "SHARE PRICE",
    subtitle: "Market Snapshot",
    description: "株価・指標の概要です。",
    ctaLabel: "SHARE PRICE",
    ctaHref: "/price",
    initialRotation: baseRotation + 2,
    innerRotation,
  },
  {
    id: "earnings",
    title: "EARNINGS",
    subtitle: "Financial Highlights",
    description: "最近の決算のハイライトとか昔の決算情報のリンクをまとめてる。\n\n今後もコンテンツcoming soon。",
    ctaLabel: "EARNINGS",
    ctaHref: "/earnings",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "contracts",
    title: "CONTRACTS",
    subtitle: "契約・提携",
    description: "契約・提携ニュースをまとめています。",
    ctaLabel: "CONTRACTS",
    ctaHref: "/contracts",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
  {
    id: "karp",
    title: "Alex Karp",
    subtitle: "Photo Gallery",
    description: "狂気と哲学と叡智を纏うCEOの写真展。\n\n奇奇怪怪とも言えるNG無しの歯に衣着せぬ発言を間髪なく世界へ放つCEOの写真展。\n\n在る人には忌まわしく、或る人には難解、私には救いの存在であるCEOの写真展。",
    ctaLabel: "KARP",
    ctaHref: "/karp",
    initialRotation: baseRotation,
    innerRotation,
    cardDecorImage: "/paradog/cards/alex_karp_card_001_v2.png",
  },
];

/** EARNINGS: 決算まとめ（ダミー） */
export const EARNINGS_SECTIONS: PageSections = [
  {
    id: "summary",
    title: "決算サマリー",
    subtitle: "直近のハイライト",
    description: "決算発表の要点をまとめています。（ダミー）",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "list",
    title: "Earnings Archive",
    subtitle: "Archive",
    description: "少し待ってね。coming soooooon.",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 3,
    innerRotation: innerRotation + 2,
  },
  {
    id: "outlook",
    title: "Guidance",
    subtitle: "Outlook",
    description: "少し待ってね。coming soooooon.",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 2,
    innerRotation,
  },
  {
    id: "more",
    title: "Learn more",
    subtitle: "External links",
    description: "公式IR・決算資料へのリンク。",
    inlineImage: { src: "/assets/logos/340-3403282_tech-crunch-logo-png.png", href: "https://investors.palantir.com/" },
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation: innerRotation + 4,
  },
];

/** CONTRACTS: 契約・提携（ダミー） */
export const CONTRACTS_SECTIONS: PageSections = [
  {
    id: "recent",
    title: "Partnerships",
    subtitle: "Latest updates",
    description: "少し待ってね。coming soooooon.",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "categories",
    title: "All Partnerships",
    subtitle: "Past to Present",
    description: "少し待ってね。coming soooooon.",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
];

/** PRICE: 株価（Card1: Price+Chart / Card2: Valuation の2枚のみ） */
export const PRICE_SECTIONS: PageSections = [
  {
    id: "price",
    title: "Share Price",
    subtitle: "Market Snapshot",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "valuation",
    title: "Valuation",
    subtitle: "How the market prices PLTR",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 3,
    innerRotation: innerRotation + 2,
  },
];

/** ABOUT: このサイトについて */
export const ABOUT_SECTIONS: PageSections = [
  {
    id: "unofficial",
    title: "Unofficial fan site",
    subtitle: "Independent Fan Site",
    description: `「ぱらどっぐ × Palantir」は、Palantir Technologies Inc.の事業・決算・IRなどの役立つ情報を、整理・可視化する非公式ファンサイトです。

本サイトは公式情報を一次ソースとして参照しつつ、Palantirに関心を持つ全ての人に向けて、"読みやすく分かりやすく"Palantirを知ってもらうことを目的としています。

管理人は「ぱらどっぐ」と申します。普段はXでPalantirについてあれこれと投稿しています。
Xだけだと情報が凄まじい勢いで流れて流れて消えていくので、ここにできるだけ残したいと思いこのサイトを作りました。

$9でPalantirにオールインした時からは株価も知名度も上がりましたが、まだまだPalantirを知らぬ多くの方にPalantirを知っていただけるよう頑張りたいと思います。

なお、本サイトは Palantir Technologies とは一切の関係がなく、公式見解・公式資料の代替を意図するものではないのであしからず。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "stance",
    title: "Stance",
    subtitle: "How we read Palantir",
    description: `ここは公式サイトじゃないので、参考程度に使ってくださいな。
とはいえ適当に書いているわけでもないので、そこそこ信頼してくださいな。

趣味は Palantir の web サイトと公式ブログを読むことなので、情報は基本的に公式情報をベースに扱っています。
噂も好きですが、基本的には数値や事実を中心に、分かりやすく整理することを信条にしとります。

ってことで、投資判断を勧めたり、結論を押し付ける意図はないです。
分かりづらかったり、疑問に思ったら、X で聞いてくれい。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
  {
    id: "links",
    title: "Links",
    subtitle: "Where to go next",
    description: "このサイトを読んで気になったら、あとはこのあたりを覗いてもらえればだいたい把握できます。",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 2,
    innerRotation,
    links: [
      { title: "Palantir Official", description: "困ったらまずここ。", url: "https://investors.palantir.com/", logo: "palantir.webp" },
      { title: "X", description: "管理人が一番うるさい場所。", url: "https://x.com/PLTR_Dog", logo: "x.avif" },
      { title: "Medium", description: "Palantirについてちゃんと書いたやつ。", url: "https://medium.com/@o8038941081", logo: "medium.svg" },
      { title: "note①", description: "Next Palantirを探してる記録。", url: "https://note.com/pltr_dog", logo: "note.svg" },
      { title: "note②", description: "資産ができたら次は金融ハック。", url: "https://note.com/pltr_dog_pt", logo: "note.svg" },
    ],
  },
];

/** COMPANY: 企業解説（Palantir） */
export const COMPANY_SECTIONS: PageSections = [
  {
    id: "company-overview",
    title: "Palantir Technologies",
    subtitle: "Introduction",
    description: `（仮）Palantir Technologies Inc. の企業解説です。

ここに本文を追加します。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
];
