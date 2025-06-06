'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentActions } from './components/agent-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTeam } from '@/context/team-context';
import { useAgents } from '@/hooks/useAgents';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useToast } from '@/hooks/use-toast';
import { PhoneIcon, PhoneOutgoing } from 'lucide-react';
import { Agent } from '@/lib/models/agent';
import Image from 'next/image';
import { useLeads } from '@/hooks/useLeads';

// New EmptyState component
const EmptyState = () => (
  <div className=" flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left py-12 md:py-16 gap-8 md:gap-12 lg:gap-16 w-full">
    <div className="flex-shrink-0 mb-6 md:mb-0">
      <Image
        src="/blueagent-agent-single.png"
        alt="Create agent illustration"
        width={600} // Base width, Tailwind classes will control display size
        height={600} // Base height, Tailwind classes will control display size
        className="rounded-lg w-full h-full" // Rounded image and responsive sizing
      />
    </div>
    <div className="flex flex-col items-center md:items-start">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans mb-3 md:mb-4">
        Create Your First Agent!
      </h2>
      <p className="text-base md:text-lg text-muted-foreground font-sans mb-6 md:mb-8 max-w-md">
        It looks like you haven&apos;t created any agents yet. Get started by creating your first intelligent assistant.
      </p>
      <Link href="/workspaces/agents/new">
        <Button size="lg" className="px-8 py-4 text-base md:text-lg font-sans">
          Create New Agent
        </Button>
      </Link>
    </div>
  </div>
);

export default function AgentsPage() {
  const { activeTeam } = useTeam();
  const teamId = activeTeam?.id;
  const { data: agents = [], isLoading, isError } = useAgents(teamId);
  const { data: leads } = useLeads(teamId);
  const { data: phoneNumbers = [] } = usePhoneNumbers(teamId);
  const { toast } = useToast();

  // State for the outbound call dialog
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [selectedAgentForCall, setSelectedAgentForCall] = useState<string | undefined>(undefined);
  const [isCalling, setIsCalling] = useState(false);
  const [selectedLeadForCall, setSelectedLeadForCall] = useState<string | undefined>(undefined);

  const outboundVoiceAgents = agents.filter(agent => agent.type === 'outbound_voice' && agent.is_active);

  useEffect(() => {
    if (outboundVoiceAgents.length > 0 && !selectedAgentForCall) {
      setSelectedAgentForCall(outboundVoiceAgents[0].id);
    }
  }, [outboundVoiceAgents, selectedAgentForCall]);

  // Create a map of phone number ID to phone number for quick lookup
  const phoneNumberMap = phoneNumbers.reduce((acc, pn) => {
    acc[pn.id] = pn;
    return acc;
  }, {} as Record<string, typeof phoneNumbers[0]>);

  const handleMakeCall = async () => {
    console.log('selectedAgentForCall', selectedAgentForCall)
    console.log('selectedLeadForCall', selectedLeadForCall)
    if (!selectedAgentForCall || !selectedLeadForCall) {
      toast({ title: 'Missing Information', description: 'Please select an agent and enter a number to call.', variant: 'destructive' });
      return;
    }
    setIsCalling(true);
    const toNumber = leads.find(lead => lead.id === selectedLeadForCall)?.phone;
    const outboundCallParams = {
      agent_id: selectedAgentForCall,
      to_number: toNumber,
      lead_id: selectedLeadForCall,
    }
    console.log('outboundCallParams', outboundCallParams)
    try {
      const response = await fetch('/api/calls/create-outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outboundCallParams),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to initiate call');
      }
      toast({ title: 'Call Initiated', description: `Calling ${toNumber}...`, duration: 3000 });
      setIsCallDialogOpen(false);
      setSelectedLeadForCall(undefined);
      setSelectedAgentForCall(undefined);
    } catch (error: unknown) {
      console.error('Error making outbound call:', error);
      const errorMessage = (error as Error).message || 'Could not initiate call.';
      toast({ variant: 'destructive', title: 'Call Failed', description: errorMessage });
    } finally {
      setIsCalling(false);
    }
  };

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
          <div className="flex gap-2">
            <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={outboundVoiceAgents.length === 0}>
                  <PhoneOutgoing className="mr-2 h-4 w-4" /> Make Outbound Call
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make an Outbound Call</DialogTitle>
                  <DialogDescription>
                    Select an active outbound voice agent and enter the phone number you want to call.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent-for-call" className="text-right">
                      Agent
                    </Label>
                    <Select
                      value={selectedAgentForCall}
                      onValueChange={setSelectedAgentForCall}
                      disabled={outboundVoiceAgents.length === 0}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={outboundVoiceAgents.length === 0 ? "No active outbound agents" : "Select an agent"} />
                      </SelectTrigger>
                      <SelectContent>
                        {outboundVoiceAgents.map((oa) => (
                          <SelectItem key={oa.id} value={oa.id}>
                            {oa.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lead-to-call" className="text-right">
                      Lead
                    </Label>
                    <Select
                      value={selectedLeadForCall}
                      onValueChange={setSelectedLeadForCall}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleMakeCall} disabled={isCalling || !selectedAgentForCall || !selectedLeadForCall || outboundVoiceAgents.length === 0}>
                    {isCalling ? 'Calling...' : 'Call'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/workspaces/agents/new">
              <Button>Create New Agent</Button>
            </Link>
          </div>
        </div>
        {/* Tab content for all agents */}
        <TabsContent value="all">
          {agents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(renderAgentCard)}
            </div>
          )}

        </TabsContent>
        {/* Tab content for inbound voice agents */}
        <TabsContent value="inbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.filter((agent) => agent.type === 'inbound_voice').length === 0 ? (
              <EmptyState />
            ) : (
              agents
                .filter((agent) => agent.type === 'inbound_voice')
                .map(renderAgentCard)
            )}
          </div>
        </TabsContent>
        {/* Tab content for outbound voice agents */}
        <TabsContent value="outbound_voice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.filter((agent) => agent.type === 'outbound_voice').length === 0 ? (
              <EmptyState />
            ) : (
              agents
                .filter((agent) => agent.type === 'outbound_voice')
                .map(renderAgentCard)
            )}
          </div>
        </TabsContent>
        {/* Tab content for browser agents */}
        <TabsContent value="browser">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.filter((agent) => agent.type === 'browser').length === 0 ? (
              <EmptyState />
            ) : (
              agents
                .filter((agent) => agent.type === 'browser')
                .map(renderAgentCard)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 