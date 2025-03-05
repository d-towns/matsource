import { Metadata } from "next";
import { Suspense } from "react";
import VideoTraining from "@/components/landing/VideoTraining";
import VideoCtaSection from "@/components/landing/VideoCtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Free AI Training for Service Businesses | Matsource",
  description: "Watch our free training to learn how AI can transform your service business and increase bookings by 200%+",
  robots: { index: false }, // Only accessible to people who filled out the form
};

export default function AITrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading training content...</div>}>
        <VideoTraining 
          headline="Watch This Free Training to Learn How to"
          highlightedText="Transform Your Business with AI"
          videoId="your-vimeo-or-wistia-id"
        />
      </Suspense>
      
      <VideoCtaSection 
        headline="Ready to Implement This in Your Business?"
        description="Book a free implementation call with our team to see how we can help you get started immediately."
        buttonText="Click Here to Book an Implementation Call"
        calendarLink="https://cal.com/yourusername/implementation-call"
      />
      
      <LandingFooter />
    </div>
  );
} 