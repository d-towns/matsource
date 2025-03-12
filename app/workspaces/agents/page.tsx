'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/use-user';

// Define agent types
interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'browser';
  description: string;
  script: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function AgentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const user = useUser();
  const {toast} = useToast()
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch agents on component mount
  useEffect(() => {
    if (!user) return;
    
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAgents(data || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load agents',
          description: 'Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [supabase, user, toast]);

  // Navigate to create new agent page
  const handleCreateAgent = (type: 'voice' | 'browser') => {
    router.push(`/workspaces/agents/new?type=${type}`);
  };

  // Navigate to edit agent page
  const handleEditAgent = (agentId: string) => {
    router.push(`/workspaces/agents/${agentId}`);
  };

  // Delete agent
  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);
        
      if (error) throw error;
      
      // Update local state to remove the deleted agent
      setAgents(agents.filter(agent => agent.id !== agentId));
      
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
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="voice">Voice Agents</TabsTrigger>
          <TabsTrigger value="browser">Browser Agents</TabsTrigger>
        </TabsList>
        
        {/* Tab content for all agents */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create new agent cards */}
            <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
              <CardHeader>
                <CardTitle>Create Voice Agent</CardTitle>
                <CardDescription>
                  Set up an agent for phone calls and voice interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PlusCircle size={60} className="text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateAgent('voice')}
                >
                  Create Voice Agent
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
              <CardHeader>
                <CardTitle>Create Browser Agent</CardTitle>
                <CardDescription>
                  Set up an agent for website chat widget interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PlusCircle size={60} className="text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateAgent('browser')}
                >
                  Create Browser Agent
                </Button>
              </CardFooter>
            </Card>
            
            {/* Existing agents */}
            {loading ? (
              <p>Loading agents...</p>
            ) : agents.length === 0 ? (
              <p>No agents found. Create your first agent!</p>
            ) : (
              agents.map(agent => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{agent.name}</CardTitle>
                      <Badge variant={agent.type === 'voice' ? 'default' : 'secondary'}>
                        {agent.type === 'voice' ? 'Voice' : 'Browser'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {agent.description || `A ${agent.type} agent`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {agent.script ? (
                        `${agent.script.substring(0, 100)}...`
                      ) : (
                        'No script defined yet'
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditAgent(agent.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Tab content for voice agents */}
        <TabsContent value="voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
              <CardHeader>
                <CardTitle>Create Voice Agent</CardTitle>
                <CardDescription>
                  Set up an agent for phone calls and voice interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PlusCircle size={60} className="text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateAgent('voice')}
                >
                  Create Voice Agent
                </Button>
              </CardFooter>
            </Card>
            
            {/* Voice agents */}
            {loading ? (
              <p>Loading voice agents...</p>
            ) : (
              agents
                .filter(agent => agent.type === 'voice')
                .map(agent => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{agent.name}</CardTitle>
                        <Badge>Voice</Badge>
                      </div>
                      <CardDescription>
                        {agent.description || 'A voice agent'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {agent.script ? (
                          `${agent.script.substring(0, 100)}...`
                        ) : (
                          'No script defined yet'
                        )}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditAgent(agent.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        {/* Tab content for browser agents */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
              <CardHeader>
                <CardTitle>Create Browser Agent</CardTitle>
                <CardDescription>
                  Set up an agent for website chat widget interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PlusCircle size={60} className="text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateAgent('browser')}
                >
                  Create Browser Agent
                </Button>
              </CardFooter>
            </Card>
            
            {/* Browser agents */}
            {loading ? (
              <p>Loading browser agents...</p>
            ) : (
              agents
                .filter(agent => agent.type === 'browser')
                .map(agent => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{agent.name}</CardTitle>
                        <Badge variant="secondary">Browser</Badge>
                      </div>
                      <CardDescription>
                        {agent.description || 'A browser agent'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {agent.script ? (
                          `${agent.script.substring(0, 100)}...`
                        ) : (
                          'No script defined yet'
                        )}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditAgent(agent.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 