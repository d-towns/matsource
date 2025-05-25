'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Home, Building2 } from 'lucide-react';

interface IndustrySelectionProps {
  onComplete: () => void;
}

const INDUSTRIES = [
  {
    id: 'home_services',
    label: 'Home Services',
    description: 'HVAC, plumbing, electrical, landscaping, cleaning, etc.',
    icon: Home
  },
  {
    id: 'other',
    label: 'Other',
    description: 'All other industries and business types',
    icon: Building2
  }
];

export function IndustrySelection({ onComplete }: IndustrySelectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedIndustry) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/teams/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          onboarding_step: 'caller_id_verification'
        }),
      });

      if (response.ok) {
        onComplete();
      } else {
        throw new Error('Failed to update industry selection');
      }
    } catch (error) {
      console.error('Error updating industry selection:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-sm font-medium font-sans text-gray-700 mb-4 block">
          What industry best describes your business? *
        </Label>
        
        <RadioGroup
          value={selectedIndustry}
          onValueChange={setSelectedIndustry}
          className="space-y-3"
        >
          {INDUSTRIES.map((industry) => {
            const IconComponent = industry.icon;
            return (
              <Card 
                key={industry.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedIndustry === industry.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={industry.id} 
                      id={industry.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <Label 
                          htmlFor={industry.id}
                          className="text-base font-medium font-sans text-gray-900 cursor-pointer"
                        >
                          {industry.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 font-sans mt-1">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!selectedIndustry || isLoading}
          className="bg-blue-600 hover:bg-blue-700 font-sans"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing Setup...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 font-sans">
          This helps us provide industry-specific features and recommendations.
        </p>
      </div>
    </form>
  );
} 