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

/** EARNINGS: 最新四半期と過去四半期を同じデータから表示 */
export const EARNINGS_SECTIONS: PageSections = [
  {
    id: "earnings-snapshot",
    title: "Earnings Snapshot",
    subtitle: "Latest Quarter Highlights",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "earnings-archive",
    title: "Earnings Archive",
    subtitle: "Past Quarter Highlights",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 3,
    innerRotation: innerRotation + 2,
  },
  {
    id: "guidance-snapshot",
    title: "Guidance Snapshot",
    subtitle: "Latest Outlook",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 2,
    innerRotation,
  },
  {
    id: "guidance-archive",
    title: "Guidance Archive",
    subtitle: "Past Outlooks",
    description: "",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
  {
    id: "earnings-materials",
    title: "Official Materials",
    subtitle: "Q2 FY2026 · Original Sources",
    description: "数字をもっと追いかけたい方はこちらへどうぞ。全部Palantirの公式資料です。",
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation: innerRotation + 4,
    links: [
      {
        title: "Earnings Release",
        description: "Q2 FY2026の公式決算発表。",
        url: "https://investors.palantir.com/news-details/2026/Palantir-Reports-Q2-2026-U-S--Comm-Revenue-Growth-of-149-YY-and-Revenue-Growth-of-93-YY-Raises-FY-2026-Revenue-Guidance-to-82-YY-Growth-and-U-S--Comm-Revenue-Guidance-to-134-YY-Crushing-Consensus-Expectations/",
        logo: "palantir.webp",
      },
      {
        title: "Letter from Alex Karp",
        description: "Karpから株主へ。数字の奥にある話。",
        url: "https://www.palantir.com/q2-2026-letter/en/",
        logo: "palantir.webp",
      },
      {
        title: "Business Update",
        description: "決算ハイライトとGuidanceのプレゼン資料。",
        url: "https://investors.palantir.com/files/Palantir%20-%20Q2%202026%20Business%20Update.pdf",
        logo: "palantir.webp",
      },
      {
        title: "Earnings Webcast",
        description: "Q2 FY2026決算説明会の動画。",
        url: "https://www.youtube.com/watch?v=yTHNjVWnoWo",
        logo: "palantir.webp",
      },
      {
        title: "Quarterly Report · 10-Q",
        description: "2026年6月30日終了四半期の法定開示。",
        url: "https://investors.palantir.com/files/2026%20Q2%20PLTR%2010-Q.pdf",
        logo: "palantir.webp",
      },
    ],
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
    subtitle: "What kind of company?",
    description: `Palantirって何の会社なのか。
データ分析の会社？AIの会社？
それとも、政府や軍で使われている謎の会社？
どれも間違いじゃなくてそれらの要素は入ってるけど、それだけだとPalantirの半分も伝わらんのです。

Palantirが作っているのは、国家や組織の中に散らばっているデータ、そこで働く人たちの知識、ルール、AI、そして実際の業務をひとつにつなぐソフトウェアです。

会社や政府は、データを持っていないわけではありません。むしろ持ちすぎてます。
部署ごとに違うシステムがあり、同じ数字なのに意味が違い、必要な情報が必要な人へ届かない。
ようやく分析が終わった頃には、現場の状況が変わってる。

Palantirは、そういう巨大組織のぐちゃぐちゃを整理して、
「今、何が起きているのか」「なぜ起きているのか」「次に何をするのか」
までを、ひとつの流れにする。ダッシュボードを眺めて満足するためのソフトウェアではなく、組織が実際に判断し、動くためのソフトウェア。まずは、そんな会社だと思ってくださいな。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation,
    innerRotation,
  },
  {
    id: "company-beginning",
    title: "The Beginning",
    subtitle: "Why Palantir was born",
    description: `Palantirは2003年に創業しました。
最初に向き合ったのは、米国のインテリジェンス機関が抱えてた対テロという、間違いがそのまま人の命や国家の安全に直結するミッションクリティカルです。

当時の政府機関には、人も予算も情報もありました。
しかし、それらを本当に使える形へまとめ、現場の判断につなげるソフトウェアがありませんでした。

データベースを新しく作るだけでは足りない。分析ツールを一個入れるだけでも足りない。
異なる場所にある情報をつなぎながら、誰が何を見られるのかを厳密に管理し、分析した結果を現場の行動まで持っていく必要がありました。

そんな面倒で、重くて、失敗の許されない問題からPalantirは始まっています。
だからPalantirの製品は、最初から「便利そうだから使うソフト」ではありません。
これが動かなければ組織そのものが困る。
そういう場所で叩き上げられてきたソフトウェアです。

その後、製造、医療、エネルギー、航空、金融、物流などにも広がっていきました。
政府と企業。一見まったく違うように見えますが、組織が大きくなればなるほど、データが分断され、判断が遅くなり、現場が苦しむという問題はよく似ています。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
  {
    id: "company-platforms",
    title: "Four Platforms",
    subtitle: "Gotham, Foundry, Apollo and AIP",
    description: `Palantirには、主に4つのソフトウェアプラットフォームがあります。
私も最初は名前だけ見ても、何がどう違うのか全然分かりませんでした。
ざっくり言うと、こんな感じです。

Gotham
国防・安全保障・インテリジェンスの現場で使われるプラットフォーム。
衛星、センサー、地図、報告書など、さまざまな情報を統合し、いま何が起きているのかを把握し、判断と行動につなげます。
Palantirの原点ともいえる製品です。

Foundry
企業や組織のためのデータ・オペレーション基盤。
工場、生産設備、在庫、受注、従業員、取引先など、バラバラに存在していた情報を、実際の業務と結びつけます。
ただのデータ置き場ではありません。現場の人が毎日の仕事で使い、判断し、その結果をまた組織へ戻していくための基盤です。

Apollo
ソフトウェアを、安全に、止めずに、さまざまな環境へ届け続けるためのプラットフォーム。
一般的なクラウドだけでなく、オンプレミスやネットワークから隔離された環境、さらには現場の端末まで扱います。
GothamやFoundry、AIPが世界中の厳しい環境で動き続けられるのは、Apolloが後ろで支えているからです。
地味に見えるけれど、ここが壊れたら全部止まる。
私はApolloも相当変態的な製品だと思っています。

AIP
AIを、企業や政府の実際の業務へつなぐためのプラットフォーム。
ChatGPTのように質問へ答えるだけではなく、組織のデータやルール、権限を守りながら、AIエージェントや自動化を現場へ組み込みます。
AIに何でも勝手にやらせるのではなく、人間が監督し、確認し、必要なら止められる形で運用する。
AIをデモから現実へ連れていくのがAIPです。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 2,
    innerRotation,
  },
  {
    id: "company-ontology",
    title: "Ontology",
    subtitle: "The heart of Palantir",
    description: `Palantirを理解するうえで避けて通れないのが、Ontologyです。
まず名前がむずい。
私も最初は、なんのこっちゃと思いました。
でも考え方は意外と単純。

普通のデータベースには、数字や文字や日付が入っています。
Ontologyでは、それを「工場」「機械」「顧客」「注文」「患者」「部隊」のように、現実世界に存在するものとして表現します。
そして、それらの関係だけじゃなくて、「注文を変更する」「在庫を移動する」「機械を停止する」「担当者へ確認を求める」といった行動まで結びつけます。

つまり、会社や組織そのものを、デジタル上で動かせる形にするのよ。
データ、ロジック、権限、行動をひとつにまとめて、人間とAIが同じ組織の状況を理解できるようにする。

ここまで来ると、Palantirが単なる企業ではない理由が見えてきます。
OntologyはPalantirの一機能ではありません。
PalantirをPalantirたらしめている、心臓みたいなものです。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 1,
    innerRotation: innerRotation + 2,
  },
  {
    id: "company-people",
    title: "The People",
    subtitle: "Who runs Palantir?",
    description: `Palantirは製品も独特ですが、経営陣も濃いです。

CEOは共同創業者のAlex Karp。
一般的なテック企業のCEOとは、だいぶ雰囲気が違います。
決算説明会でも、製品機能より先に哲学、国家、戦争、西側社会の未来について語り始める。
数字だけ聞きたい人はたぶん少し困ります。

でもPalantirの場合、その思想と製品が切り離されていません。
何を作るのかだけでなく、誰のために作るのか。
その技術を、どんな社会を守るために使うのか。
Karpはそこを何度も正面から語ってきました。

共同創業者でPresidentのStephen Cohenは、製品と技術の中心を長く支えてきた人物。
共同創業者で取締役会長のPeter Thielは、創業時から会社の長期的な方向性を支えています。
そしてCTOのShyam Sankar。
Palantirの製品、現場主義、米国の製造業や国防に対する考え方を理解するなら、この人の話も外せません。

派手な肩書だけ並べた経営チームではなく、創業から長く会社に残り、同じ問題へ執念深く向き合ってきた人たちが中核にいる。
それもPalantirらしさのひとつです。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 1,
    innerRotation,
  },
  {
    id: "company-philosophy",
    title: "Philosophy",
    subtitle: "What Palantir believes",
    description: `Palantirは、ポリコレ、見栄え、世間体、好感度、中立っぽい顔をする会社ではありません。
自分たちが誰の側に立ち、何を守ろうとしているのかを、かなりはっきり言います。

民主主義の制度や、西側諸国の安全と繁栄を、ソフトウェアの力で支える。
政府や軍との仕事から逃げず、戦争や安全保障の現実からも目をそらさない。
ここは、人によって好き嫌いが分かれるところだと思います。

ただ、Palantirはその難しい仕事を隠して、耳ざわりのいい言葉だけを並べている会社ではありません。
自分たちのソフトウェアが現実世界へ大きな影響を与えることを認めたうえで、プライバシー、市民的自由、アクセス権限、監査、人間による判断を製品の中へ組み込もうとしています。

そしてもうひとつ、Palantirがずっと大切にしているのが「結果」です。
立派なDX計画を作った。
AI戦略を発表した。
データ基盤へ巨額のお金を使った。
でも、現場が何も変わっていなければ意味がない。

Palantirは、言葉や約束ではなく、実際に何が変わったのかで自分たちの価値を示そうとします。
綺麗な理想の世界ではなく、いま目の前にある、ややこしくて危険で思いどおりにならない世界を直視する。
そして、その世界で重要な組織がちゃんと機能し、生き残れるようにソフトウェアを作る。
私は、そこにPalantirという会社の思想があると思っています。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation - 2,
    innerRotation: innerRotation + 2,
  },
  {
    id: "company-closing",
    title: "Closing",
    subtitle: "What Palantir is",
    description: `Palantirは、分かりやすい会社ではありません。
製品は複雑。思想強め。
国防にもAIにも企業経営にも出てくる。
知れば知るほど「結局なんの会社なんだ」となる瞬間もあります。

でも、その全部に共通しているものがあります。
人と組織が、現実を正しく理解し、より良い判断をして、実際に動けるようにすること。

それが政府であっても、病院であっても、工場であっても、戦場であっても、Palantirがやろうとしていることは基本的に変わりません。

ソフトウェアで、重要な組織を強くする。
それがPalantir Technologiesという会社です。`,
    ctaLabel: "TOP",
    ctaHref: "/",
    initialRotation: baseRotation + 2,
    innerRotation: innerRotation + 4,
  },
];
