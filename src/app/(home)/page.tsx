// import { Hero } from "@/components/Hero";
// import { FAQ } from "@/components/FAQ";
// import FeaturesGrid from "@/components/FeaturesGrid";
// // import BlogSection from "@/components/BlogSection";
// // import ExpertiseSection from "@/components/ExpertiseSection";
// import ExpertiseGrid from "@/components/ExpertiseGrid";
// import BlueAgentFormDemo from "@/components/BlueAgentFormDemo";
// import { Pricing } from "@/components/Pricing";
// // import { getAllPosts } from "./blog/actions";
// import CalendarSection from "@/components/ui/CalendarSection";
// import { AudioPlayer } from "@/components/AudioPlayer";
// // import { ValidationSection } from "@/components/ValidationSection";
// import { DotMatrix } from "@/components/DotMatrix";
// import { HeroSideBySide } from "@/components/HeroSideBySide";
import { redirect } from "next/navigation";
// import ProblemStatsSection from "@/components/ProblemStatsSection";
// import { QuestionSection } from "@/components/QuestionSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // const allPosts = await getAllPosts();

  redirect("/signin");

  // return (
  //   <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
  //     {/* Full Page Dot Matrix Background */}
  //     <DotMatrix 
  //       dotSize={1}
  //       spacing={20}
  //       opacity={0.4}
  //       // animated={false}
  //       className="fixed inset-0 z-0 text-gray-400"
  //     />
      
  //     <main className="relative z-10">
  //       {/* Hero Section */}
  //       <HeroSideBySide />
        
  //       <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
  //         <div className="container">
  //           <h2 className="text-4xl font-sans font-bold text-center mb-8">
  //             Instead of voicemail, send your customers to an intelligent AI
  //           </h2>
  //           <AudioPlayer />
  //         </div>
  //       </section>

  //       <FeaturesGrid />
        
  //       {/* Problem Stats Section */}
  //       {/* <ProblemStatsSection /> */}
        
  //       {/* <QuestionSection /> */}

  //       <ExpertiseGrid />

  //       {/* BlueAgent Form Demo Section */}
  //       <BlueAgentFormDemo />

  //       {/* <ValidationSection /> */}

  //       {/* Audio Player Section */}

  //       {/* Pricing Section */}
  //       <Pricing />

  //       {/* <BlogSection allPosts={allPosts} /> */}

  //       <FAQ />

  //       <CalendarSection />
  //     </main>
  //   </div>
  // );
}
