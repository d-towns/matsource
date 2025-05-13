import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import FeaturesGrid from "@/components/FeaturesGrid";
// import BlogSection from "@/components/BlogSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import { Pricing } from "@/components/Pricing";
// import { getAllPosts } from "./blog/actions";
import CalendarSection from "@/components/ui/CalendarSection";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ValidationSection } from "@/components/ValidationSection";
// import { QuestionSection } from "@/components/QuestionSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // const allPosts = await getAllPosts();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <Hero />
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container">
            <h2 className="text-4xl font-sans font-bold text-center mb-8">
              Listen to a sample of our work!
            </h2>
            <AudioPlayer />
          </div>
        </section>

        <FeaturesGrid />
        
        {/* <QuestionSection /> */}

        <ExpertiseSection />

        <ValidationSection />

        {/* Audio Player Section */}

        {/* Pricing Section */}
        <Pricing />

        {/* <BlogSection allPosts={allPosts} /> */}

        <FAQ />

        <CalendarSection />
      </main>
    </div>
  );
}
