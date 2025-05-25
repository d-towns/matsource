'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlanSelection } from '@/components/onboarding/plan-selection';
import { TeamDetails } from '@/components/onboarding/team-details';
import { IndustrySelection } from '@/components/onboarding/industry-selection';
import { CallerIdVerification } from '@/components/onboarding/caller-id-verification';

type OnboardingStep = 'plan_selection' | 'team_details' | 'industry_selection' | 'caller_id_verification' | 'completed';

const STEPS: { key: OnboardingStep; title: string; description: string }[] = [
  {
    key: 'plan_selection',
    title: 'Choose Your Plan',
    description: 'Select the plan that best fits your needs'
  },
  {
    key: 'team_details',
    title: 'Team Information',
    description: 'Set up your team name and description'
  },
  {
    key: 'industry_selection',
    title: 'Industry Selection',
    description: 'Tell us about your industry'
  },
  {
    key: 'caller_id_verification',
    title: 'Verify Phone Number',
    description: 'Set up your business caller ID for outbound calls'
  }
];

export function OnboardingLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('plan_selection');

  useEffect(() => {
    const step = searchParams.get('step') as OnboardingStep;
    if (step && STEPS.find(s => s.key === step)) {
      setCurrentStep(step);
    }
  }, [searchParams]);

  const currentStepIndex = STEPS.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleStepComplete = async (nextStep?: OnboardingStep) => {
    if (nextStep) {
      setCurrentStep(nextStep);
      router.push(`/onboarding?step=${nextStep}`);
    } else {
      // Onboarding completed
      router.push('/workspaces/dashboard');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'plan_selection':
        return <PlanSelection onComplete={() => handleStepComplete('team_details')} />;
      case 'team_details':
        return <TeamDetails onComplete={() => handleStepComplete('industry_selection')} />;
      case 'industry_selection':
        return <IndustrySelection onComplete={() => handleStepComplete('caller_id_verification')} />;
      case 'caller_id_verification':
        return (
          <CallerIdVerification 
            onComplete={() => handleStepComplete()} 
            onSkip={() => handleStepComplete()}
          />
        );
      default:
        return null;
    }
  };

  const currentStepData = STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold font-sans text-gray-900">
              Welcome to MatBot
            </CardTitle>
            <p className="text-gray-600 font-sans mt-2">
              Let&apos;s get you set up in just a few steps
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium font-sans text-gray-600 mb-2">
                <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Step Info */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold font-sans text-gray-900">
                {currentStepData?.title}
              </h2>
              <p className="text-gray-600 font-sans mt-1">
                {currentStepData?.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 