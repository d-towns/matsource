import { Sparkles } from "lucide-react";
import { WaitlistWidget } from "@/components/WaitlistWidget";

interface FeatureCTAProps {
  title: string;
  subtitle: string;
  statistic?: string;
}

export function FeatureCTA({ title, subtitle, statistic }: FeatureCTAProps) {
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 md:p-12 my-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 text-white px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            {statistic || "AI-Powered Solution"}
          </span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8">
          {subtitle}
        </p>
        
        <WaitlistWidget />
      </div>
    </div>
  );
} 