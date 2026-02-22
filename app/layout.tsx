import type { Metadata } from "next";
import {
  M_PLUS_Rounded_1c,
  Kosugi_Maru,
} from "next/font/google";
import "./globals.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const kosugiMaru = Kosugi_Maru({
  variable: "--font-kosugi",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ぱらどっぐ × Palantir — unofficial fan site",
  description: "ぱらどっぐ × Palantir 非公式ファンサイト（unofficial fan site）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${mPlusRounded.variable} ${kosugiMaru.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
