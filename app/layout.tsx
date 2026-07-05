import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "PrAha 管理コンソール",
  description: "課題・チーム・進捗を管理する社内向け管理画面（モック）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoJp.variable} h-full`}
    >
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
