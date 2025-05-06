'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface CreateAgentCardProps {
  type: 'inbound_voice' | 'outbound_voice' | 'browser';
}

export function CreateAgentCard({ type }: CreateAgentCardProps) {
  const router = useRouter();

  // Navigate to create new agent page
  const handleCreateAgent = () => {
    router.push(`/workspaces/agents/new?type=${type}`);
  };

  return (
    <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
      <CardHeader>
        <CardTitle>Create {type === 'inbound_voice' ? 'Inbound Voice' : type === 'outbound_voice' ? 'Outbound Voice' : 'Browser'} Agent</CardTitle>
        <CardDescription>
          {type === 'inbound_voice' 
            ? 'Set up an agent for phone calls and voice interactions'
            : type === 'outbound_voice'
              ? 'Set up an agent for outbound voice calls'
              : 'Set up an agent for executing multi-step actions in a browser'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PlusCircle size={60} className="text-muted-foreground" />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleCreateAgent}
        >
          Create {type === 'inbound_voice' ? 'Inbound Voice' : type === 'outbound_voice' ? 'Outbound Voice' : 'Browser'} Agent
        </Button>
      </CardFooter>
    </Card>
  );
} 