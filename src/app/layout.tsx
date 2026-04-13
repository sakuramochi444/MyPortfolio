import type { Metadata } from "next";
import "./globals.css";
import "./portfolio.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "三宅 泰知 | My Portfolio",
  description: "三宅 泰知のポートフォリオサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        
        <div className="bg-decorations">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-5"></div>
          <div className="circle circle-6"></div>
        </div>
      </body>
    </html>
  );
}
