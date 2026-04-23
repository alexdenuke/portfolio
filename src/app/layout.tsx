import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { BackgroundAnchorsProvider } from "@/components/background-anchors";
import { GlobalBackgroundStage } from "@/components/background-renderer";
import { getLocale } from "next-intl/server";
import "./globals.css";

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
);

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
  metadataBase,
  title: "Frontend Developer Portfolio",
  description:
    "Modern portfolio landing page with a reusable dark background system.",
  openGraph: {
    title: "Frontend Developer Portfolio",
    description:
      "Modern portfolio landing page with a reusable dark background system.",
    type: "website",
    images: [
      {
        url: "/preview.png",
        alt: "Frontend Developer Portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Developer Portfolio",
    description:
      "Modern portfolio landing page with a reusable dark background system.",
    images: ["/preview.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
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
