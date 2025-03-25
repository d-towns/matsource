import Link from "next/link";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import FeaturesGrid from "@/components/FeaturesGrid";
import BlogSection from "@/components/BlogSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import { Pricing } from "@/components/Pricing";
import { getAllPosts } from "./blog/actions";
import CalendarSection from "@/components/ui/CalendarSection";
export default async function Home() {
  const allPosts = await getAllPosts();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <Hero />

        <FeaturesGrid />

        <ExpertiseSection />
        
        {/* Pricing Section */}
        <Pricing />

        <BlogSection allPosts={allPosts} />

          <FAQ />

          <CalendarSection />
      </main>

    {/* Footer */}
      <footer className="py-8 md:py-12 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-3xl mr-2" role="img" aria-label="Construction Worker">
                👨‍🔧
              </span>
              <span className="text-base md:text-lg font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                BlueAgent
              </span>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
              <Link href="/privacy-policy" className=" hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className=" hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className=" hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} BlueAgent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
