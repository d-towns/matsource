import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentActions } from './components/agent-actions';
import { CreateAgentCard } from './components/create-agent-card';
import Link from 'next/link';

export default async function AgentsPage() {
  const supabase = await createClient();
  
  // Fetch agents directly in the server component
  const { data: agents = [], error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agents:', error);
    // Handle the error appropriately
  }

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
            <CreateAgentCard type="voice" />
            <CreateAgentCard type="browser" />
            
            {/* Existing agents */}
            {agents.length === 0 ? (
              <p>No agents found. Create your first agent!</p>
            ) : (
              agents.map(agent => (
                <Card key={agent.id}>
                  <Link href={`/workspaces/agents/${agent.id}`}>
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
                    <AgentActions agent={agent} />
                  </CardFooter>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Tab content for voice agents */}
        <TabsContent value="voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            
            {/* Voice agents */}
            {agents
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
                    <AgentActions agent={agent} />
                  </CardFooter>
                </Card>
              ))
            }
            <CreateAgentCard type="voice" />
          </div>
        </TabsContent>
        
        {/* Tab content for browser agents */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateAgentCard type="browser" />
            
            {/* Browser agents */}
            {agents
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
                    <AgentActions agent={agent} />
                  </CardFooter>
                </Card>
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 