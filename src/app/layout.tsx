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
    default: "BlueAgent | AI Automation for Service Businesses",
    template: "%s | BlueAgent"
  },
  description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
  keywords: ["AI automation", "service business", "voice AI", "customer service automation", "parts procurement"],
  authors: [{ name: "BlueAgent Team" }],
  creator: "BlueAgent",
  publisher: "BlueAgent",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://blueagent.co"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blueagent.co",
    title: "BlueAgent | AI Automation for Service Businesses",
    description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
    siteName: "BlueAgent",
    images: [
      {
        url: "/marketing_splash.png",
        width: 1200,
        height: 630,
        alt: "BlueAgent - Service Business Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlueAgent | Service Business Automation",
    description: "AI-Powered Efficiency for Service Businesses: Dispatch Smarter, Serve Faster, Profit More.",
    creator: "@blueagentai",
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
