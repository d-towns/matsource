'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTeam } from '@/context/team-context';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useAddAgent, useUpdateAgent } from '@/hooks/useAgents';
import { VoiceSelector } from '@/components/ui/voice-selector';
import { ModelSelector } from '@/components/ui/model-selector';

import { Agent } from '@/lib/models/agent';

interface AgentEditFormProps {
  initialAgent: Agent | null;
  isNewAgent: boolean;
  searchType?: string;
}

export function AgentEditForm({ initialAgent, isNewAgent, searchType }: AgentEditFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const { activeTeam } = useTeam();

  console.log('initialAgent', initialAgent)
  
  const { data: phoneNumbers = [], isLoading: phoneNumbersLoading } = usePhoneNumbers(activeTeam?.id);
  const verifiedPhoneNumbers = phoneNumbers.filter(pn => pn.verification_status === 'success');
  
  // React Query mutations
  const addAgentMutation = useAddAgent(activeTeam?.id);
  const updateAgentMutation = useUpdateAgent(activeTeam?.id);
  
  const [agent, setAgent] = useState<Agent | null>(() => {
    if (initialAgent) return initialAgent;
    if (isNewAgent) {
      const type = searchType as 'inbound_voice' | 'outbound_voice' | 'browser' || 'inbound_voice';
      return {
        id: '',
        name: '',
        type,
        description: '',
        script: type === 'inbound_voice' || type === 'outbound_voice'
          ? `You are a friendly and professional representative for our company.\nYour goal is to have a natural conversation with the customer to understand their needs.\n\nImportant guidelines:\n- Be conversational and natural, as if you're a real person having a casual conversation\n- Avoid sounding like a script or a traditional IVR system\n- Use natural pauses, filler words occasionally, and conversational transitions\n- Adapt to the customer's tone and energy level\n- Listen carefully to their requirements and respond appropriately`
          : '',
        is_active: true,
        phone_number: null,
        voice_id: null,
        llm_model_id: null
      };
    }
    return null;
  });

  const handleChange = (field: keyof Agent, value: string | boolean | null) => {
    if (!agent) return;
    setAgent({ ...agent, [field]: value });
  };

  const handleSave = async () => {
    if (!agent || !user || !activeTeam) return;
    
    try {
      if (isNewAgent) {
        const agentInput = {
          name: agent.name,
          type: agent.type,
          description: agent.description,
          script: agent.script,
          is_active: agent.is_active,
          phone_number: agent.phone_number,
          voice_id: agent.voice_id,
          llm_model_id: agent.llm_model_id,
        };
        
        const createdAgent = await addAgentMutation.mutateAsync(agentInput);
        toast({ title: 'Agent created', description: 'Agent successfully created.', duration: 3000 });
        router.push(`/workspaces/agents/${createdAgent.id}`);
      } else {
        const updates = {
          name: agent.name,
          description: agent.description,
          script: agent.script,
          is_active: agent.is_active,
          phone_number: agent.phone_number,
          voice_id: agent.voice_id,
          llm_model_id: agent.llm_model_id,
        };
        
        await updateAgentMutation.mutateAsync({ id: agent.id, updates });
        toast({ title: 'Agent updated', description: 'Agent successfully updated.', duration: 3000 });
        router.push('/workspaces/agents');
      }
    } catch (error: unknown) {
      console.error('Error saving agent:', error);
      const errorMessage = (error as Error).message || 'Please try again.';
      toast({ variant: 'destructive', title: 'Failed to save agent', description: errorMessage });
    }
  };

  const saving = addAgentMutation.isPending || updateAgentMutation.isPending;

  if (!agent) {
    return <div className="container py-10">Agent not found or loading...</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isNewAgent ? 'Create New Agent' : `Edit Agent: ${agent.name}`}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/workspaces/agents')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : (isNewAgent ? 'Create Agent' : 'Save Agent')}
          </Button>
        </div>
      </div>
      
            {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:grid-rows-2">
        {/* Section 1: Basic Information */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Configure the basic details of your agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input 
                id="name"
                value={agent.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="My Customer Service Agent"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Agent Type</Label>
              <Input
                id="type"
                value={agent.type !== 'browser' ? 'Voice Agent' : 'Browser Agent'}
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={agent.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what this agent does"
                rows={3}
              />
            </div>

            {(agent.type === 'inbound_voice' || agent.type === 'outbound_voice') && (
              <div>
                <Label htmlFor="phone_number_id">Phone Number (Caller ID for Outbound)</Label>
                <Select
                  value={agent.phone_number || 'none'}
                  onValueChange={(value) => handleChange('phone_number', value === 'none' ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      phoneNumbersLoading 
                        ? "Loading phone numbers..." 
                        : verifiedPhoneNumbers.length === 0 
                          ? "No verified caller IDs available"
                          : "Select a verified caller ID"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No phone number (Agent cannot make/receive calls)</SelectItem>
                    {verifiedPhoneNumbers.map((phoneNumber) => (
                      <SelectItem key={phoneNumber.id} value={phoneNumber.id}>
                        {phoneNumber.phone_number} 
                        {phoneNumber.friendly_name && ` (${phoneNumber.friendly_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {verifiedPhoneNumbers.length === 0 && !phoneNumbersLoading && agent.type === 'outbound_voice' && (
                  <p className="text-sm text-destructive mt-1">
                    Outbound agents require a verified phone number to make calls. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm text-destructive"
                      onClick={() => router.push('/workspaces/phone-numbers/new?verified=true')}
                    >
                      Add a verified number.
                    </Button>
                  </p>
                )}
                 {verifiedPhoneNumbers.length === 0 && !phoneNumbersLoading && agent.type === 'inbound_voice' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No verified phone numbers available. This agent won&apos;t be able to receive calls directly until a number is assigned. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm"
                      onClick={() => router.push('/workspaces/phone-numbers/new')}
                    >
                      Add a phone number.
                    </Button>
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={agent.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Agent Script */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Agent Script</CardTitle>
            <CardDescription>
              {agent.type !== 'browser'
                ? 'Define the script for your voice agent. This will be used to guide the AI in phone conversations.'
                : 'Configure how your browser agent should interact with visitors on your website.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea 
              value={agent.script}
              onChange={(e) => handleChange('script', e.target.value)}
              placeholder="Enter your agent script here..."
              className="font-mono flex-1 min-h-0 resize-none"
            />
          </CardContent>
        </Card>

        {/* Section 3: Voice Configuration (only for voice agents) */}
        {(agent.type === 'inbound_voice' || agent.type === 'outbound_voice') && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Voice Configuration</CardTitle>
              <CardDescription>
                Select the voice that your agent will use for text-to-speech
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <VoiceSelector
                selectedVoiceId={agent.voice_id}
                onVoiceSelect={(voiceId) => handleChange('voice_id', voiceId)}
              />
            </CardContent>
          </Card>
        )}

        {/* Section 4: Language Model (only for voice agents) */}
        {(agent.type === 'inbound_voice' || agent.type === 'outbound_voice') && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Language Model</CardTitle>
              <CardDescription>
                Choose the AI model that will power your agent&apos;s conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ModelSelector
                selectedModelId={agent.llm_model_id}
                onModelSelect={(modelId) => handleChange('llm_model_id', modelId)}
              />
            </CardContent>
          </Card>
        )}

        {/* For browser agents, show placeholder cards to maintain grid */}
        {agent.type === 'browser' && (
          <>
            <Card className="h-full flex flex-col opacity-50">
              <CardHeader>
                <CardTitle>Voice Configuration</CardTitle>
                <CardDescription>
                  Not applicable for browser agents
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Browser agents don&apos;t use voice synthesis</p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col opacity-50">
              <CardHeader>
                <CardTitle>Language Model</CardTitle>
                <CardDescription>
                  Not applicable for browser agents
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Browser agents use default language model</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push('/workspaces/agents')}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Agent'}
        </Button>
      </div>
    </div>
  );
} 