import { Suspense } from 'react';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { Loader2 } from 'lucide-react';

function OnboardingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 font-sans mt-2">Loading onboarding...</p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingLayout />
    </Suspense>
  );
} 