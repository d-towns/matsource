'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDeleteAgent } from '@/hooks/useAgents';
import { useTeam } from '@/context/team-context';
import { Agent } from '@/lib/models/agent';

interface AgentActionsProps {
  agent: Agent;
}

export function AgentActions({ agent }: AgentActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { activeTeam } = useTeam();
  const deleteAgentMutation = useDeleteAgent(activeTeam?.id);

  // Navigate to edit agent page
  const handleEditAgent = () => {
    router.push(`/workspaces/agents/${agent.id}`);
  };

  // Delete agent
  const handleDeleteAgent = async () => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteAgentMutation.mutateAsync(agent.id);
      
      toast({
        title: 'Agent deleted',
        description: 'The agent has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete agent',
        description: 'Please try again later.'
      });
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleEditAgent}
      >
        <Edit size={16} />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleDeleteAgent}
        disabled={deleteAgentMutation.isPending}
      >
        <Trash2 size={16} />
      </Button>
    </>
  );
} 