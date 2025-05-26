'use client';

import { useDomains } from '@/hooks/useDomains';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useAgents } from '@/hooks/useAgents';
import { useTeam } from '@/context/team-context';
import { useToast } from '@/hooks/use-toast';
import { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CopyIcon, CheckIcon, GlobeIcon } from 'lucide-react';
import { AgentTypeEnum } from '@/lib/models/agent';

function EmbedCodeGeneratorContent({ teamId }: { teamId: string }) {
  const { toast } = useToast();
  const { data: domains, isLoading: isDomainsLoading, isError: isDomainsError } = useDomains(teamId);
  const { data: apiKeys, isLoading: isApiKeysLoading, isError: isApiKeysError } = useApiKeys(teamId);
  const { data: agents, isLoading: isAgentsLoading, isError: isAgentsError } = useAgents(teamId);
  const [generating, setGenerating] = useState(false);
  const [formName, setFormName] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Toggle domain selection
  const toggleDomain = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      setSelectedDomains(selectedDomains.filter(id => id !== domainId));
    } else {
      setSelectedDomains([...selectedDomains, domainId]);
    }
  };

  // Generate embed code
  const handleGenerateEmbed = async () => {
    if (!formName || !selectedAgent || !selectedApiKey || selectedDomains.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing required fields',
        description: 'Please fill in all required fields.'
      });
      return;
    }
    try {
      setGenerating(true);
      const apiKey = apiKeys?.find(key => key.id === selectedApiKey);
      if (!apiKey) throw new Error('Selected API key not found');
      const domainValues = selectedDomains.map(id => {
        const domain = domains?.find(d => d.id === id);
        return domain ? domain.domain : '';
      }).filter(Boolean);
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.id
        },
        body: JSON.stringify({
          formName,
          agentId: selectedAgent,
          domains: domainValues
        })
      });
      if (!response.ok) throw new Error('Failed to generate token');
      const data = await response.json();
      setEmbedCode(data.embedCode);
      toast({ title: 'Embed code generated', description: 'Your embed code has been generated successfully.' });
    } catch (error) {
      console.error('Error generating embed code:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to generate embed code',
        description: 'Please try again later.'
      });
    } finally {
      setGenerating(false);
    }
  };

  // Copy embed code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Please try manually selecting and copying the code.'
        });
      });
  };

  if (isDomainsLoading || isApiKeysLoading || isAgentsLoading) {
    return <EmbedCodeGeneratorSkeleton />;
  }
  if (isDomainsError || isApiKeysError || isAgentsError) {
    return <div className="text-destructive">Failed to load integration data.</div>;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Embed Code</CardTitle>
          <CardDescription>
            Create an embed code to integrate your agent into your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-name">Form Name</Label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contact Form"
            />
          </div>
          <div>
            <Label htmlFor="agent">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents?.filter(agent => agent.type === AgentTypeEnum.Values.inbound_voice).map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select an API key" />
              </SelectTrigger>
              <SelectContent>
                {apiKeys?.map(key => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Allowed Domains</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {domains?.map(domain => (
                <Button
                  key={domain.id}
                  type="button"
                  variant={selectedDomains.includes(domain.id) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleDomain(domain.id)}
                >
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  {domain.domain}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleGenerateEmbed}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Embed Code'}
          </Button>
        </CardFooter>
      </Card>
      {embedCode && (
        <Card>
          <CardHeader>
            <CardTitle>Your Embed Code</CardTitle>
            <CardDescription>
              Copy this code and paste it into your website where you want the widget to appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                value={embedCode}
                readOnly
                rows={5}
                className="font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmbedCodeGeneratorSkeleton() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Embed Code</CardTitle>
          <CardDescription>
            Create an embed code to integrate your agent into your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-muted rounded w-full animate-pulse" />
          <div className="h-10 bg-muted rounded w-full animate-pulse" />
          <div className="h-10 bg-muted rounded w-full animate-pulse" />
          <div className="h-10 bg-muted rounded w-full animate-pulse" />
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-muted rounded w-full animate-pulse" />
        </CardFooter>
      </Card>
    </div>
  );
}

export function EmbedCodeGenerator() {
  const { activeTeam } = useTeam();
  if (!activeTeam?.id) return <div className="text-muted-foreground">No team selected.</div>;
  return (
    <Suspense fallback={<EmbedCodeGeneratorSkeleton />}>
      <EmbedCodeGeneratorContent teamId={activeTeam.id} />
    </Suspense>
  );
} 