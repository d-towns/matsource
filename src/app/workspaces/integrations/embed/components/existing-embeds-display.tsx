'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForms } from '@/hooks/useForms';
import { useAgents } from '@/hooks/useAgents';
import { useTeam } from '@/context/team-context';
import { Form } from '@/lib/services/FormsService';
import { Suspense } from 'react';

function ExistingEmbedsDisplayContent({ teamId }: { teamId: string }) {
  const { toast } = useToast();
  const { data: forms, isLoading: isFormsLoading, isError: isFormsError } = useForms(teamId);
  const { data: agents, isLoading: isAgentsLoading, isError: isAgentsError } = useAgents(teamId);

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
        console.error('Failed to copy to clipboard:', err);
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Please try manually selecting and copying the code.'
        });
      });
  };

  const handleGenerateNewEmbed = () => {
    (document.querySelector('[data-state="inactive"][value="generate"]') as HTMLElement)?.click();
  };

  if (isFormsLoading || isAgentsLoading) {
    return <ExistingEmbedsDisplaySkeleton />;
  }
  if (isFormsError || isAgentsError) {
    return <div className="text-destructive">Failed to load embed data.</div>;
  }
console.log('forms', forms)
  // Type assertion to allow form.domains
  const formsWithDomains = forms as (Form & { domains: string[] })[];
  console.log('agents', agents)
  return (
    <div className="grid gap-6">
      {(!formsWithDomains || formsWithDomains.length === 0) ? (
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
        formsWithDomains.map(form => {
          
          const agent = agents?.find(a => a.id === form.agent_id);
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

function ExistingEmbedsDisplaySkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ExistingEmbedsDisplay() {
  const { activeTeam } = useTeam();
  if (!activeTeam?.id) return <div className="text-muted-foreground">No team selected.</div>;
  return (
    <Suspense fallback={<ExistingEmbedsDisplaySkeleton />}>
      <ExistingEmbedsDisplayContent teamId={activeTeam.id} />
    </Suspense>
  );
} 