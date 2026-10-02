export type Story = {
  slug: string;
  name: string;
  handle: string;
  avatar: string;
  quote?: string;
  title?: string;
  decoration?: string;
  readerDecoration?: string;
  introduction?: string;
  paragraphs: string[];
};

// Add approved contributors here. Image paths are relative to public/.
// Use /images/stories/decorations/ for the supplied peeking mascots.
export const STORIES: Story[] = [{
  slug: "pltr-dog",
  decoration: "/images/stories/decorations/paradog-peeking-fullbody-smug-v1.png",
  readerDecoration: "/images/stories/reader-decorations/paradog-king-v1.png",
  name: "ぱらどっぐ",
  handle: "@PLTR_Dog",
  avatar: "/images/stories/profiles/pltr-dog.png",
  quote: "調べれば調べるほどPalantirを好きになっていく。",
  paragraphs: [
    "Peter Thielの「ZERO to ONE」を読んで、ずっと彼をウォッチしていました。\nその彼がPalantirという創業するというニュースを聞いたのがこの企業を知ったきっかけです。\nPalantirへの投資を決めた理由は、上場後にAlex Karpのインタビューを初めて聞いた時でした。\nPeter ThielとAlex Karp、この二人は当時のテック企業のCEOたちとは何か異質だと感じたことが決め手です。",
    "Palantirの魅力は、理念、創業者、経営陣、株主、事業内容の全てです。\n投資をしてみて思うことは、調べれば調べるほどPalantirを好きになっていくことです。\nそして何より、大きな大きな経済的リターン（まだ含み益）を得たことは本当に嬉しい。",
    "Palantirに期待することは、世界を大きく変えてほしい。\nどこかの未来で、近代が歴史として振り返られた時に、Palantirの名がそこに残っていて欲しいです。\n一個人ではありますが、それを支えた株主として今を生きていたいです。",
  ],
}];
