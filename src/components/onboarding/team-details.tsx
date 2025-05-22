'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface TeamDetailsProps {
  onComplete: () => void;
}

export function TeamDetails({ onComplete }: TeamDetailsProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Team description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
          name: formData.name,
          description: formData.description,
          onboarding_step: 'industry_selection'
        }),
      });

      if (response.ok) {
        onComplete();
      } else {
        throw new Error('Failed to update team details');
      }
    } catch (error) {
      console.error('Error updating team details:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="team-name" className="text-sm font-medium font-sans text-gray-700">
            Team Name *
          </Label>
          <Input
            id="team-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your team name"
            className={`mt-1 font-sans ${errors.name ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-600 font-sans mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="team-description" className="text-sm font-medium font-sans text-gray-700">
            Team Description *
          </Label>
          <Textarea
            id="team-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your team does..."
            rows={4}
            className={`mt-1 font-sans ${errors.description ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-sm text-red-600 font-sans mt-1">{errors.description}</p>
          )}
          <p className="text-sm text-gray-500 font-sans mt-1">
            This helps us customize your experience and provide relevant features.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 font-sans"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  );
} 