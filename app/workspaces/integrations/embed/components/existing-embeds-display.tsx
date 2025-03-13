'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'browser';
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

interface ExistingEmbedsDisplayProps {
  forms: Form[];
  agents: Agent[];
}

export function ExistingEmbedsDisplay({ forms, agents }: ExistingEmbedsDisplayProps) {
  const { toast } = useToast();

  // Copy embed code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: 'Copied to clipboard',
          description: 'The embed code has been copied to your clipboard.'
        });
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

  const handleGenerateNewEmbed = () => {
    // Find and click the generate tab
    (document.querySelector('[data-state="inactive"][value="generate"]') as HTMLElement)?.click();
  };

  return (
    <div className="grid gap-6">
      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No embed codes generated yet</p>
            <Button 
              variant="outline"
              onClick={handleGenerateNewEmbed}
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
                      onClick={() => copyToClipboard(form.embed_code)}
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
  );
} 