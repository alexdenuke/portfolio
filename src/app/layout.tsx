import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import { BackgroundAnchorsProvider } from "@/components/background-anchors";
import { GlobalBackgroundStage } from "@/components/background-renderer";
import { getLocale } from "next-intl/server";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
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
      className={`${sora.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <BackgroundAnchorsProvider>
          <GlobalBackgroundStage>{children}</GlobalBackgroundStage>
        </BackgroundAnchorsProvider>
      </body>
    </html>
  );
}
