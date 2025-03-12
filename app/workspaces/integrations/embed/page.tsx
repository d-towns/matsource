'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, CheckIcon, GlobeIcon, PlusCircle, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Define domain and form types
interface Domain {
  id: string;
  domain: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'browser';
}

interface ApiKey {
  id: string;
  name: string;
}

interface Form {
  id: string;
  name: string;
  agent_id: string;
  api_key_id: string;
  created_at: string;
  embed_code: string;
  domains: string[];
}

export default function EmbedPage() {
  const supabase = createClient();
  const {user} = useUser()
  const {toast} = useToast()
  const [domains, setDomains] = useState<Domain[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formName, setFormName] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [newDomain, setNewDomain] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch domains
        const { data: domainData, error: domainError } = await supabase
          .from('domains')
          .select('*');
        
        if (domainError) throw domainError;
        setDomains(domainData || []);
        
        // Fetch agents
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('id, name, type');
        
        if (agentError) throw agentError;
        setAgents(agentData || []);
        
        // Fetch API keys
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('id, name');
        
        if (apiKeyError) throw apiKeyError;
        setApiKeys(apiKeyData || []);
        
        // Fetch forms
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('*');
        
        if (formError) throw formError;

        console.log("formData", formData);
        
        // Fetch form domains for each form
        const formsWithDomains = await Promise.all(
          (formData || []).map(async (form) => {
            const { data: domainData, error: domainError } = await supabase
              .from('form_domains')
              .select('domain')
              .eq('form_id', form.id);
            
            return {
              ...form,
              domains: domainError ? [] : domainData.map(d => d.domain)
            };
          })
        );
        
        setForms(formsWithDomains);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load data',
          description: 'Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Add a new domain
  const handleAddDomain = async () => {
    if (!newDomain) return;
    
    // Simple domain validation
    if (!/^(\*\.)?[a-zA-Z0-9][\w-]+(\.[\w-]+)+$/.test(newDomain)) {
      toast({
        variant: 'destructive',
        title: 'Invalid domain format',
        description: 'Please enter a valid domain like example.com or *.example.com'
      });
      return;
    }
    
    try {
      setAddingDomain(true);
      
      // Add domain to database
      const { data, error } = await supabase
        .from('domains')
        .insert({ domain: newDomain, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setDomains([...domains, data]);
      setNewDomain('');
      
      toast({
        title: 'Domain added',
        description: 'Your domain has been added successfully.'
      });
    } catch (error) {
      console.error('Error adding domain:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add domain',
        description: 'Please try again later.'
      });
    } finally {
      setAddingDomain(false);
    }
  };

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
      
      // Get the API key for the token generation request
      const apiKey = apiKeys.find(key => key.id === selectedApiKey);
      
      if (!apiKey) {
        throw new Error('Selected API key not found');
      }
      
      // Get domains
      const domainValues = selectedDomains.map(id => {
        const domain = domains.find(d => d.id === id);
        return domain ? domain.domain : '';
      }).filter(Boolean);
      
      // Call your API endpoint to generate a token and embed code
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.id // In a real implementation, you'd use the actual API key value
        },
        body: JSON.stringify({
          formName,
          agentId: selectedAgent,
          domains: domainValues
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
      
      const data = await response.json();
      
      // Set the generated embed code
      setEmbedCode(data.embedCode);
      
      toast({
        title: 'Embed code generated',
        description: 'Your embed code has been generated successfully.'
      });
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
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Please try manually selecting and copying the code.'
        });
      });
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website Integration</h1>
      </div>
      
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generate">Generate Embed</TabsTrigger>
          <TabsTrigger value="domains">Manage Domains</TabsTrigger>
          <TabsTrigger value="existing">Existing Embeds</TabsTrigger>
        </TabsList>
        
        {/* Generate Embed Tab */}
        <TabsContent value="generate">
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
                      {agents
                        .filter(agent => agent.type === 'voice')
                        .map(agent => (
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
                      {apiKeys.map(key => (
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
                    {domains.map(domain => (
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
        </TabsContent>
        
        {/* Manage Domains Tab */}
        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Manage Domains</CardTitle>
              <CardDescription>
                Add and manage domains where your widget can be embedded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-domain">Add New Domain</Label>
                  <Input 
                    id="new-domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com or *.example.com"
                  />
                </div>
                <Button 
                  onClick={handleAddDomain}
                  disabled={addingDomain || !newDomain}
                >
                  {addingDomain ? 'Adding...' : 'Add Domain'}
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Your Domains</h3>
                {domains.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No domains added yet</p>
                ) : (
                  <div className="space-y-2">
                    {domains.map(domain => (
                      <div 
                        key={domain.id}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center">
                          <GlobeIcon className="mr-2 h-4 w-4" />
                          <span>{domain.domain}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Existing Embeds Tab */}
        <TabsContent value="existing">
          <div className="grid gap-6">
            {forms.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-4">No embed codes generated yet</p>
                  <Button 
                    variant="outline"
                    onClick={() => (document.querySelector('[data-state="inactive"][value="generate"]') as HTMLElement)?.click()}
                  >
                    Generate Your First Embed
                  </Button>
                </CardContent>
              </Card>
            ) : (
              forms.map(form => {
                const agent = agents.find(a => a.id === form.agent_id);
                
                return (
                  <Card key={form.id}>
                    <CardHeader>
                      <CardTitle>{form.name}</CardTitle>
                      <CardDescription>
                        Created on {new Date(form.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Agent</Label>
                        <p>{agent?.name || 'Unknown Agent'}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Allowed Domains</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {form.domains.map((domain, i) => (
                            <div 
                              key={i}
                              className="bg-muted text-muted-foreground text-sm px-2 py-1 rounded-md"
                            >
                              {domain}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Embed Code</Label>
                        <div className="relative mt-1">
                          <Textarea 
                            value={form.embed_code}
                            readOnly
                            rows={3}
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              navigator.clipboard.writeText(form.embed_code);
                              toast({
                                title: 'Copied to clipboard',
                                description: 'The embed code has been copied to your clipboard.'
                              });
                            }}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 