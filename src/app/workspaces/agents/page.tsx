import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentActions } from './components/agent-actions';
import { CreateAgentCard } from './components/create-agent-card';
import Link from 'next/link';
import { Agent } from '@/lib/models/agent';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getAgents } from '@/lib/services/AgentService';
import { cookies } from 'next/headers';

export default async function AgentsPage() {
  const cookieStore = await cookies();
  const teamId = cookieStore.get('activeTeam')?.value;
  if (!teamId) {
    // Optionally, you could redirect or show an error here
    return <div className="container py-10">No team selected.</div>;
  }

  let agents: Agent[] = [];
  let isLoading = false;
  try {
    agents = await getAgents(teamId);
  } catch (error) {
    // Optionally, handle error state here
    return <div className="container py-10">Failed to load agents.</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="inbound_voice">Inbound Voice Agents</TabsTrigger>
          <TabsTrigger value="outbound_voice">Outbound Voice Agents</TabsTrigger>
          <TabsTrigger value="browser">Browser Agents</TabsTrigger>
        </TabsList>
        {/* Tab content for all agents */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateAgentCard type="inbound_voice" />
            <CreateAgentCard type="outbound_voice" />
            <CreateAgentCard type="browser" />
            {agents.length === 0 ? (
              <p>No agents found. Create your first agent!</p>
            ) : (
              agents.map((agent: Agent) => (
                <Card key={agent.id}>
                  <Link href={`/workspaces/agents/${agent.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{agent.name}</CardTitle>
                        <Badge variant={agent.type === 'outbound_voice' ? 'default' : agent.type === 'inbound_voice' ? 'secondary' : 'secondary'}>
                          {agent.type === 'outbound_voice' ? 'Outbound Voice' : agent.type === 'inbound_voice' ? 'Inbound Voice' : 'Browser'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {agent.description || `A ${agent.type.replace('_', ' ')} agent`}
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
        {/* Tab content for inbound voice agents */}
        <TabsContent value="inbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents
              .filter((agent: Agent) => agent.type === 'inbound_voice')
              .map((agent: Agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{agent.name}</CardTitle>
                      <Badge>Inbound Voice</Badge>
                    </div>
                    <CardDescription>
                      {agent.description || 'An inbound voice agent'}
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
            <CreateAgentCard type="inbound_voice" />
          </div>
        </TabsContent>
        {/* Tab content for outbound voice agents */}
        <TabsContent value="outbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateAgentCard type="outbound_voice" />
            {agents
              .filter((agent: Agent) => agent.type === 'outbound_voice')
              .map((agent: Agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{agent.name}</CardTitle>
                      <Badge variant="default">Outbound Voice</Badge>
                    </div>
                    <CardDescription>
                      {agent.description || 'An outbound voice agent'}
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
        {/* Tab content for browser agents */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateAgentCard type="browser" />
            {agents
              .filter((agent: Agent) => agent.type === 'browser')
              .map((agent: Agent) => (
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