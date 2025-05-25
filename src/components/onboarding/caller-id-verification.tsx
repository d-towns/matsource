'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  ShoppingCart,
  ArrowLeft
} from 'lucide-react';
import { useCallerIdVerification } from '@/hooks/useCallerIdVerification';
import { useTeam } from '@/context/team-context';

interface CallerIdVerificationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

type UserChoice = 'existing' | 'new' | null;
type FlowState = 'choice' | 'verification' | 'purchased_number' | 'completed';

interface PurchasedNumber {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  type: string;
}

export function CallerIdVerification({ onComplete, onSkip }: CallerIdVerificationProps) {
  const { activeTeam } = useTeam();
  
  // State management
  const [flowState, setFlowState] = useState<FlowState>('choice');
  const [purchasedNumber, setPurchasedNumber] = useState<PurchasedNumber | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [choiceError, setChoiceError] = useState<string | null>(null);
  
  // Existing verification state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    friendlyName: '',
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [verificationId, setVerificationId] = useState<string | undefined>(undefined);

  const {
    isLoading,
    error,
    verificationResult,
    startVerification,
    clearError,
    isVerifying,
    isSuccess,
    isFailed,
  } = useCallerIdVerification({
    teamId: activeTeam?.id || '',
    verificationId,
    onSuccess: () => {
      updateOnboardingStep();
    },
  });

  // Update verification ID when verification result changes
  useEffect(() => {
    if (verificationResult?.id && !verificationId) {
      setVerificationId(verificationResult.id);
    }
  }, [verificationResult, verificationId]);

  // Function to update onboarding step to completed
  const updateOnboardingStep = async () => {
    try {
      await fetch('/api/teams/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboarding_step: 'completed'
        }),
      });
      
      setFlowState('completed');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      onComplete();
    }
  };

  const handleSkip = async () => {
    await updateOnboardingStep();
    if (onSkip) {
      onSkip();
    }
  };

  // Handle user choice between existing and new number
  const handleChoice = async (choice: UserChoice) => {
    setChoiceError(null);

    if (choice === 'existing') {
      setFlowState('verification');
      return;
    }

    if (choice === 'new') {
      setIsProcessing(true);
      
      try {
        const response = await fetch('/api/onboarding/phone-choice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            choice: 'new',
            teamId: activeTeam?.id,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to purchase phone number');
        }

        setPurchasedNumber(result.phoneNumber);
        setFlowState('purchased_number');
      } catch (error) {
        console.error('Error purchasing phone number:', error);
        setChoiceError(error instanceof Error ? error.message : 'Failed to purchase phone number');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle verification form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber.trim() || !formData.friendlyName.trim()) {
      return;
    }

    // Ensure phone number is in E.164 format
    let phoneNumber = formData.phoneNumber.trim();
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+1' + phoneNumber.replace(/\D/g, '');
    }

    setHasStarted(true);
    await startVerification(phoneNumber, formData.friendlyName);
  };

  const handleRetry = async () => {
    setHasStarted(true);
    await startVerification(formData.phoneNumber, formData.friendlyName);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      clearError();
    }
  };

  const handleBackToChoice = () => {
    setFlowState('choice');
    setHasStarted(false);
    setVerificationId(undefined);
    clearError();
  };

  const handleUsePurchasedNumber = async () => {
    await updateOnboardingStep();
  };

  // Render choice selection screen
  if (flowState === 'choice') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-sans text-gray-900 mb-2">
            Phone Number Setup
          </h2>
          <p className="text-gray-600 font-sans">
            Choose how you&apos;d like to set up your business phone number for making calls
          </p>
        </div>

        {choiceError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{choiceError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200 border-2"
            onClick={() => !isProcessing && handleChoice('existing')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold font-sans mb-2">I have my own number</h3>
              <p className="text-sm text-gray-600 font-sans mb-4">
                Verify your existing business phone number to use as caller ID for outbound calls
              </p>
              <div className="text-xs text-gray-500 font-sans">
                • Requires phone verification call
                • Use your existing business number
                • Free verification process
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-green-500 hover:shadow-md transition-all duration-200 border-2"
            onClick={() => !isProcessing && handleChoice('new')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold font-sans mb-2">I don&apos;t have a number</h3>
              <p className="text-sm text-gray-600 font-sans mb-4">
                We&apos;ll provide you with a new business phone number ready to use immediately
              </p>
              <div className="text-xs text-gray-500 font-sans">
                • Instant setup, no verification needed
                • Professional business number
                • Ready for immediate use
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button type="button" variant="ghost" onClick={handleSkip}>
            Skip for Now
          </Button>
        </div>
      </div>
    );
  }

  // Render purchased number display
  if (flowState === 'purchased_number' && purchasedNumber) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold font-sans text-green-800">
              Your New Business Number is Ready!
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <div className="bg-white border border-green-200 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Business Phone Number:</p>
              <div className="text-3xl font-mono font-bold text-gray-900 tracking-wider mb-2">
                {purchasedNumber.phoneNumber}
              </div>
              <p className="text-sm text-gray-600">
                {purchasedNumber.friendlyName}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm font-sans text-left">
                  <p className="font-medium text-blue-900 mb-1">What&apos;s next:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• This number is ready to use for outbound calls</li>
                    <li>• Customers will see this number when you call them</li>
                    <li>• You can configure agents to use this number</li>
                    <li>• No verification needed - it&apos;s ready to go!</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleUsePurchasedNumber}
              className="bg-green-600 hover:bg-green-700 font-sans"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render verification flow (existing logic)
  if (flowState === 'verification') {
    // Show verification status if started
    if (hasStarted && verificationResult) {
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToChoice}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {isVerifying && (
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                )}
                {isSuccess && (
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                )}
                {isFailed && (
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                )}
              </div>
              
              <CardTitle className="text-xl font-bold font-sans">
                {isVerifying && 'Verifying Your Phone Number'}
                {isSuccess && 'Phone Number Verified!'}
                {isFailed && 'Verification Failed'}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              {isVerifying && (
                <>
                  <p className="text-gray-600 font-sans">
                    We&apos;re calling <strong>{formData.phoneNumber}</strong> now.
                  </p>
                  <p className="text-sm text-gray-500 font-sans">
                    Please answer the call and enter the 6-digit code when prompted.
                  </p>
                  
                  {verificationResult?.validationCode && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Verification Code:
                      </p>
                      <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                        {verificationResult.validationCode}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        This code will be spoken to you during the call
                      </p>
                    </div>
                  )}
                  
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Phone className="w-3 h-3 mr-1" />
                    Call in progress...
                  </Badge>
                </>
              )}

              {isSuccess && (
                <>
                  <p className="text-green-600 font-sans font-medium">
                    Your phone number has been successfully verified and can now be used as a caller ID for outbound calls.
                  </p>
                  <p className="text-sm text-gray-500 font-sans">
                    Redirecting to the next step...
                  </p>
                </>
              )}

              {isFailed && (
                <>
                  <p className="text-red-600 font-sans">
                    We couldn&apos;t verify your phone number. This might happen if:
                  </p>
                  <ul className="text-sm text-gray-600 font-sans text-left space-y-1 max-w-md mx-auto">
                    <li>• The call wasn&apos;t answered</li>
                    <li>• The wrong code was entered</li>
                    <li>• The number is not reachable</li>
                  </ul>
                  
                  <div className="flex justify-center space-x-3 mt-4">
                    <Button
                      onClick={handleRetry}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={handleBackToChoice} variant="ghost">
                      Choose Different Option
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show verification form
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" onClick={handleBackToChoice}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium font-sans text-gray-700">
                Business Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="mt-1 font-sans"
                required
              />
              <p className="text-xs text-gray-500 font-sans mt-1">
                This will be used as your caller ID for outbound calls
              </p>
            </div>

            <div>
              <Label htmlFor="friendlyName" className="text-sm font-medium font-sans text-gray-700">
                Display Name *
              </Label>
              <Input
                id="friendlyName"
                type="text"
                placeholder="Your Business Name"
                value={formData.friendlyName}
                onChange={(e) => handleInputChange('friendlyName', e.target.value)}
                className="mt-1 font-sans"
                required
              />
              <p className="text-xs text-gray-500 font-sans mt-1">
                How this number will appear to customers
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm font-sans">
                  <p className="font-medium text-blue-900 mb-1">How verification works:</p>
                  <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                    <li>We&apos;ll call your business phone number</li>
                    <li>Answer the call and listen for a 6-digit code</li>
                    <li>Enter the code when prompted</li>
                    <li>Your number will be verified for outbound calls</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Skip for Now
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !formData.phoneNumber.trim() || !formData.friendlyName.trim()}
              className="bg-blue-600 hover:bg-blue-700 font-sans ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Verification...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Verify Phone Number
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Completion state
  if (flowState === 'completed') {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold font-sans">Setup Complete!</h2>
        <p className="text-gray-600 font-sans">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return null;
} 