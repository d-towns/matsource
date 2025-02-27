import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    default: "Matsource | AI Automation for Skilled Trades Businesses",
    template: "%s | Matsource AI"
  },
  description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
  keywords: ["AI automation", "service business", "voice AI", "customer service automation", "parts procurement"],
  authors: [{ name: "Matsource Team" }],
  creator: "Matsource AI",
  publisher: "Matsource AI",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://matsource-production.up.railway.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matsource-production.up.railway.app",
    title: "Matsource AI | Service Business Automation",
    description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
    siteName: "Matsource AI",
    images: [
      {
        url: "/marketing_splash.png",
        width: 1200,
        height: 630,
        alt: "Matsource AI - Service Business Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matsource AI | Service Business Automation",
    description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
    creator: "@matsourceai",
    images: ["/marketing_splash.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },
};
