'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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

export interface Agent {
  id: string;
  name: string;
  type: 'inbound_voice' | 'outbound_voice' | 'browser';
  description: string;
  script: string;
  is_active: boolean;
  phone_number?: string | null;
  phone_number_id?: string | null;
}

interface AgentEditFormProps {
  initialAgent: Agent | null;
  isNewAgent: boolean;
  searchType?: string;
}

export function AgentEditForm({ initialAgent, isNewAgent, searchType }: AgentEditFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUser();
  const { toast } = useToast();
  const { activeTeam } = useTeam();

  console.log('initialAgent', initialAgent)
  
  const { data: phoneNumbers = [], isLoading: phoneNumbersLoading } = usePhoneNumbers(activeTeam?.id);
  const verifiedPhoneNumbers = phoneNumbers.filter(pn => pn.verification_status === 'success');
  
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
        phone_number_id: null
      };
    }
    return null;
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Agent, value: string | boolean | null) => {
    if (!agent) return;
    if (field === 'phone_number') {
        setAgent({ ...agent, phone_number_id: value as string | null });
    } else if (field === 'phone_number_id') {
        setAgent({ ...agent, phone_number_id: value as string | null });
    } else {
        setAgent({ ...agent, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!agent || !user || !activeTeam) return;
    
    try {
      setSaving(true);
      const agentPayload = {
        name: agent.name,
        type: agent.type,
        description: agent.description,
        script: agent.script,
        is_active: agent.is_active,
        phone_number_id: agent.phone_number_id,
        user_id: user.id,
        team_id: activeTeam.id
      };
      
      if (isNewAgent) {
        const { data, error } = await supabase
          .from('agents')
          .insert(agentPayload)
          .select()
          .single();
          
        if (error) throw error;
        toast({ title: 'Agent created', description: 'Agent successfully created.', duration: 3000 });
        router.push(`/workspaces/agents/${data.id}`);
        router.refresh();
      } else {
        const { error } = await supabase
          .from('agents')
          .update({
            name: agent.name,
            description: agent.description,
            script: agent.script,
            is_active: agent.is_active,
            phone_number_id: agent.phone_number_id
          })
          .eq('id', agent.id);
          
        if (error) throw error;
        toast({ title: 'Agent updated', description: 'Agent successfully updated.', duration: 3000 });
        router.push('/workspaces/agents');
        router.refresh();
      }
    } catch (error: unknown) {
      console.error('Error saving agent:', error);
      const errorMessage = (error as Error).message || 'Please try again.';
      toast({ variant: 'destructive', title: 'Failed to save agent', description: errorMessage });
    } finally {
      setSaving(false);
    }
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Configure the basic details of your agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Agent Script</CardTitle>
          <CardDescription>
            {agent.type !== 'browser'
              ? 'Define the script for your voice agent. This will be used to guide the AI in phone conversations.'
              : 'Configure how your browser agent should interact with visitors on your website.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={agent.script}
            onChange={(e) => handleChange('script', e.target.value)}
            placeholder="Enter your agent script here..."
            rows={15}
            className="font-mono"
          />
        </CardContent>
      </Card>
      
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