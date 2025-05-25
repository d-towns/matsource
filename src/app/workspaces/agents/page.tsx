'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentActions } from './components/agent-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/context/team-context';
import { useAgents } from '@/hooks/useAgents';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { PhoneIcon } from 'lucide-react';
import { Agent } from '@/lib/models/agent';

export default function AgentsPage() {
  const { activeTeam } = useTeam();
  const teamId = activeTeam?.id;
  const { data: agents = [], isLoading, isError } = useAgents(teamId);
  const { data: phoneNumbers = [] } = usePhoneNumbers(teamId);

  // Create a map of phone number ID to phone number for quick lookup
  const phoneNumberMap = phoneNumbers.reduce((acc, pn) => {
    acc[pn.id] = pn;
    return acc;
  }, {} as Record<string, typeof phoneNumbers[0]>);

  const renderAgentCard = (agent: Agent) => (
    <Card key={agent.id}>
      <Link href={`/workspaces/agents/${agent.id}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{agent.name}</CardTitle>
            <Badge
              variant={
                agent.type === 'outbound_voice'
                  ? 'default'
                  : agent.type === 'inbound_voice'
                  ? 'secondary'
                  : 'secondary'
              }
            >
              {agent.type === 'outbound_voice'
                ? 'Outbound Voice'
                : agent.type === 'inbound_voice'
                ? 'Inbound Voice'
                : 'Browser'}
            </Badge>
          </div>
          <CardDescription>
            {agent.description || `A ${agent.type.replace('_', ' ')} agent`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {agent.script
              ? `${agent.script.substring(0, 100)}...`
              : 'No script defined yet'}
          </p>
          {/* Show phone number for voice agents */}
          {(agent.type === 'inbound_voice' || agent.type === 'outbound_voice') && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4" />
              {agent.phone_number && phoneNumberMap[agent.phone_number] ? (
                <span className="font-mono">
                  {phoneNumberMap[agent.phone_number].phone_number}
                  {phoneNumberMap[agent.phone_number].friendly_name && 
                    ` (${phoneNumberMap[agent.phone_number].friendly_name})`
                  }
                </span>
              ) : (
                <span className="text-muted-foreground">No phone number assigned</span>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <AgentActions agent={agent} />
        </CardFooter>
      </Link>
    </Card>
  );

  if (!teamId) {
    return <div className="container py-10">No team selected.</div>;
  }

  if (isLoading) {
    return <div className="container py-10">Loading agents...</div>;
  }
  if (isError) {
    return <div className="container py-10">Failed to load agents.</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="inbound_voice">Inbound Voice Agents</TabsTrigger>
            <TabsTrigger value="outbound_voice">Outbound Voice Agents</TabsTrigger>
            <TabsTrigger value="browser">Browser Agents</TabsTrigger>
          </TabsList>
          <Link href="/workspaces/agents/new">
            <Button>Create New Agent</Button>
          </Link>
        </div>
        {/* Tab content for all agents */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.length === 0 ? (
              <p>No agents found. Create your first agent!</p>
            ) : (
              agents.map(renderAgentCard)
            )}
          </div>
        </TabsContent>
        {/* Tab content for inbound voice agents */}
        <TabsContent value="inbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents
              .filter((agent) => agent.type === 'inbound_voice')
              .map(renderAgentCard)
            }
          </div>
        </TabsContent>
        {/* Tab content for outbound voice agents */}
        <TabsContent value="outbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents
              .filter((agent) => agent.type === 'outbound_voice')
              .map(renderAgentCard)
            }
          </div>
        </TabsContent>
        {/* Tab content for browser agents */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents
              .filter((agent) => agent.type === 'browser')
              .map(renderAgentCard)
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 