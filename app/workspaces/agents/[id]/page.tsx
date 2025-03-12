'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {useUser} from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Define agent types
interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'browser';
  description: string;
  script: string;
  is_active: boolean;
}

export default function AgentEditPage() {
  const router = useRouter();
  const supabase = createClient()
  const {user} = useUser()
  const {toast} = useToast()
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const params = useParams();
  const isNewAgent = params.id === 'new';

  // Fetch agent on component mount
  useEffect(() => {
    if (isNewAgent) {
      // Initialize a new agent based on query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get('type') as 'voice' | 'browser' || 'voice';
      
      setAgent({
        id: '',
        name: '',
        type,
        description: '',
        script: type === 'voice' 
          ? `You are a friendly and professional representative for our company.
Your goal is to have a natural conversation with the customer to understand their needs.

Important guidelines:
- Be conversational and natural, as if you're a real person having a casual conversation
- Avoid sounding like a script or a traditional IVR system
- Use natural pauses, filler words occasionally, and conversational transitions
- Adapt to the customer's tone and energy level
- Listen carefully to their requirements and respond appropriately`
          : '',
        is_active: true
      });
      setLoading(false);
      return;
    }
    
    const fetchAgent = async () => {
      if (!user) return;
      try {

        setLoading(true);
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setAgent(data);
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch agent',
          description: 'Please try again later.'
        });
        router.push('/workspaces/agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [supabase, params.id, isNewAgent, router, user, toast]);

  // Handle form field changes
  const handleChange = (field: keyof Agent, value: string | boolean) => {
    if (!agent) return;
    setAgent({ ...agent, [field]: value });
  };

  // Save agent
  const handleSave = async () => {
    if (!agent) return;
    
    try {
      setSaving(true);
      
      if (isNewAgent) {
        // Create new agent
        const { data, error } = await supabase
          .from('agents')
          .insert({
            name: agent.name,
            type: agent.type,
            description: agent.description,
            script: agent.script,
            is_active: agent.is_active,
            user_id: user.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: 'Agent created',
          description: 'Your agent has been successfully created.',
          variant: 'default',
          duration: 2000
        });
        
        // Navigate to the edit page for the new agent
        router.push(`/workspaces/agents/${data.id}`);
      } else {
        // Update existing agent
        const { error } = await supabase
          .from('agents')
          .update({
            name: agent.name,
            description: agent.description,
            script: agent.script,
            is_active: agent.is_active
          })
          .eq('id', agent.id);
          
        if (error) throw error;
        
        toast({
          title: 'Agent updated',
          description: 'Your agent has been successfully updated.'
        });
      }
      
      // Return to agents list
      router.push('/workspaces/agents');
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save agent',
        description: 'Please try again later.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (!agent) {
    return <div className="container py-10">Agent not found</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isNewAgent ? 'Create New Agent' : 'Edit Agent'}
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
            {saving ? 'Saving...' : 'Save Agent'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
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
                value={agent.type === 'voice' ? 'Voice Agent' : 'Browser Agent'}
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
        
        {/* Script Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Script</CardTitle>
            <CardDescription>
              {agent.type === 'voice' 
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
        
        {/* Action Buttons */}
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
    </div>
  );
} 