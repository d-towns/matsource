import Link from "next/link";
import { Pricing } from "@/components/Pricing";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {/* Hero Section */}
        <Hero />

        <Features />

        {/* Pricing Section */}
        <Pricing />

        <FAQ />
      </main>

      {/* Footer */}
      <footer className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👷‍♂️
              </span>
              <span className="text-lg font-bold">Matsource</span>
            </div>
            <nav className="flex gap-6">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Matsource. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
