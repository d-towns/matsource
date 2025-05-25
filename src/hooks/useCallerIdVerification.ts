import { useState, useEffect, useCallback } from 'react';
import { CallerIdVerificationResult } from '@/lib/services/PhoneNumberService';

interface UseCallerIdVerificationProps {
  teamId: string;
  verificationId?: string;
  pollingInterval?: number;
  onSuccess?: (result: CallerIdVerificationResult) => void;
  onFailure?: (result: CallerIdVerificationResult) => void;
}

interface UseCallerIdVerificationReturn {
  // State
  isLoading: boolean;
  error: string | null;
  verificationResult: CallerIdVerificationResult | null;
  
  // Actions
  startVerification: (phoneNumber: string, friendlyName: string) => Promise<void>;
  checkStatus: () => Promise<void>;
  clearError: () => void;
  
  // Computed
  isVerifying: boolean;
  isSuccess: boolean;
  isFailed: boolean;
}

export function useCallerIdVerification({
  teamId,
  verificationId,
  pollingInterval = 3000,
  onSuccess,
  onFailure,
}: UseCallerIdVerificationProps): UseCallerIdVerificationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<CallerIdVerificationResult | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Start verification process
  const startVerification = useCallback(async (phoneNumber: string, friendlyName: string) => {
    console.log('startVerification: Starting verification for', phoneNumber);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/onboarding/caller-id/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          phoneNumber,
          friendlyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start verification');
      }

      const result = await response.json();
      console.log('startVerification: Received result:', result);
      setVerificationResult(result);
      console.log('startVerification: Starting polling');
      setIsPolling(true);
    } catch (err) {
      console.error('startVerification: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start verification');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  // Check verification status
  const checkStatus = useCallback(async () => {
    if (!verificationId) {
      console.log('checkStatus: No verificationId, skipping');
      return;
    }

    console.log('checkStatus: Checking status for verificationId:', verificationId);

    try {
      const response = await fetch(
        `/api/onboarding/caller-id/${verificationId}/status?teamId=${teamId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check status');
      }

      const result = await response.json();
      console.log('checkStatus: Received result:', result);
      setVerificationResult(result);

      // Stop polling if verification is complete
      if (result.status === 'success' || result.status === 'failed') {
        console.log('checkStatus: Verification complete, stopping polling');
        setIsPolling(false);
        
        if (result.status === 'success' && onSuccess) {
          console.log('checkStatus: Calling onSuccess callback');
          onSuccess(result);
        } else if (result.status === 'failed' && onFailure) {
          console.log('checkStatus: Calling onFailure callback');
          onFailure(result);
        }
      }
    } catch (err) {
      console.error('checkStatus: Error checking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check status');
      setIsPolling(false);
    }
  }, [verificationId, teamId, onSuccess, onFailure]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Polling effect
  useEffect(() => {
    if (!isPolling || !verificationId) {
      console.log('Polling effect: Not starting polling', { isPolling, verificationId });
      return;
    }

    console.log('Polling effect: Starting polling with interval:', pollingInterval);
    const interval = setInterval(checkStatus, pollingInterval);
    
    // Check immediately
    console.log('Polling effect: Checking status immediately');
    checkStatus();

    return () => {
      console.log('Polling effect: Cleaning up interval');
      clearInterval(interval);
    };
  }, [isPolling, verificationId, checkStatus, pollingInterval]);

  // Auto-start polling if verificationId is provided
  useEffect(() => {
    if (verificationId && !verificationResult) {
      console.log('Auto-start polling effect: Starting polling for verificationId:', verificationId);
      setIsPolling(true);
    }
  }, [verificationId, verificationResult]);

  // Computed values
  const isVerifying = verificationResult?.status === 'pending' || isPolling;
  const isSuccess = verificationResult?.status === 'success';
  const isFailed = verificationResult?.status === 'failed';

  return {
    // State
    isLoading,
    error,
    verificationResult,
    
    // Actions
    startVerification,
    checkStatus,
    clearError,
    
    // Computed
    isVerifying,
    isSuccess,
    isFailed,
  };
} 