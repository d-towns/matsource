'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface PlanSelectionProps {
  onComplete: () => void;
}

interface StripePlan {
  id: string;
  productId: string;
  name: string;
  description: string;
  unitAmount: number | null;
  currency: string;
  interval: string;
  intervalCount: number;
  trialPeriodDays: number | null;
  metadata: Record<string, string>;
  formattedPrice: string;
  formattedInterval: string;
}

export function PlanSelection({}: PlanSelectionProps) {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans from Stripe on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch('/api/stripe/prices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        setPlans(data.prices);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans. Please refresh the page.');
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = async (priceId: string) => {
    setIsLoading(true);
    setSelectedPlan(priceId);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(false);
      setSelectedPlan(null);
      // You might want to show an error toast here
    }
  };

  // Helper function to extract features from metadata
  const getFeatures = (plan: StripePlan): string[] => {
    const features = [];
    
    // Log metadata for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Plan ${plan.name} metadata:`, plan.metadata);
    }
    
    if (plan.metadata.pool_minutes) {
      features.push(`${parseInt(plan.metadata.pool_minutes).toLocaleString()} pool minutes`);
    }
    
    if (plan.metadata.concurrency_max) {
      features.push(`${plan.metadata.concurrency_max} concurrent calls`);
    }
    
    // Add default features based on price tier (only if no metadata features found)
    const hasMetadataFeatures = plan.metadata.pool_minutes || plan.metadata.concurrency_max;
    
    if (!hasMetadataFeatures) {
      // Fallback features when no metadata is available
      if (plan.unitAmount && plan.unitAmount >= 20000) { // $200+
        features.push('Advanced analytics', 'Priority support', 'Custom integrations', 'Dedicated account manager');
      } else if (plan.unitAmount && plan.unitAmount >= 8000) { // $80+
        features.push('Advanced analytics', 'Priority support', 'Custom integrations');
      } else {
        features.push('Basic analytics', 'Email support');
      }
    } else {
      // Add standard features when metadata is available
      if (plan.unitAmount && plan.unitAmount >= 20000) { // $200+
        features.push('Advanced analytics', 'Priority support', 'Custom integrations', 'Dedicated account manager');
      } else if (plan.unitAmount && plan.unitAmount >= 8000) { // $80+
        features.push('Advanced analytics', 'Priority support', 'Custom integrations');
      } else {
        features.push('Basic analytics', 'Email support');
      }
    }
    
    return features;
  };

  // Determine if a plan should be marked as popular (middle tier)
  const isPopular = (plan: StripePlan, index: number): boolean => {
    if (plans.length === 3) {
      return index === 1; // Middle plan
    }
    return false;
  };

  if (isLoadingPlans) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 font-sans mt-2">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
          <p className="text-red-600 font-sans mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-4 font-sans"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
          <p className="text-gray-600 font-sans mt-2">No pricing plans available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const popular = isPopular(plan, index);
          const features = getFeatures(plan);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              {popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-sans">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-bold font-sans text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold font-sans text-gray-900">
                    {plan.formattedPrice}
                  </span>
                  <span className="text-gray-600 font-sans">
                    {plan.formattedInterval}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-sans mt-2">
                  {plan.description || 'Professional plan for your business'}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm font-sans">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isLoading}
                  className={`w-full font-sans ${
                    popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 font-sans">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
} 