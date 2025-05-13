import { Sparkles } from "lucide-react";
import { BookDemoButton } from "../BookDemoButton";

interface FeatureCTAProps {
  title: string;
  subtitle: string;
  statistic?: string;
}

export function FeatureCTA({ title, subtitle, statistic }: FeatureCTAProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-gray-300 p-8 md:p-12 my-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 mb-6 bg-primary text-white px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            {statistic || "AI-Powered Solution"}
          </span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          {title}
        </h3>
        
        <p className="text-gray-700 mb-8">
          {subtitle}
        </p>
        <div className="mt-8 flex justify-center">  
          <BookDemoButton />
        </div>
      </div>
    </div>
  );
} 