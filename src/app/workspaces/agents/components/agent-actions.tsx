'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Agent } from '@/lib/models/agent';

interface AgentActionsProps {
  agent: Agent;
}

export function AgentActions({ agent }: AgentActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

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
      setIsDeleting(true);
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agent.id);
        
      if (error) throw error;
      
      toast({
        title: 'Agent deleted',
        description: 'The agent has been deleted successfully.'
      });
      
      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete agent',
        description: 'Please try again later.'
      });
    } finally {
      setIsDeleting(false);
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
        disabled={isDeleting}
      >
        <Trash2 size={16} />
      </Button>
    </>
  );
} 