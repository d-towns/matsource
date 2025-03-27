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
    </div>
  );
}
