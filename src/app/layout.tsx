import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { BackgroundAnchorsProvider } from "@/components/background-anchors";
import { GlobalBackgroundStage } from "@/components/background-renderer";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Frontend Developer Portfolio",
  description:
    "Modern portfolio landing page with a reusable dark background system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <BackgroundAnchorsProvider>
          <GlobalBackgroundStage>{children}</GlobalBackgroundStage>
        </BackgroundAnchorsProvider>
      </body>
    </html>
  );
}
