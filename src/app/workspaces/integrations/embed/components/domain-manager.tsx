'use client';

import { useDomains, useAddDomain, useDeleteDomain } from '@/hooks/useDomains';
import { useTeam } from '@/context/team-context';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlobeIcon } from 'lucide-react';

function DomainManagerContent({ teamId }: { teamId: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState('');
  const addDomain = useAddDomain(teamId);
  const deleteDomain = useDeleteDomain(teamId);
  const { data: domains, isLoading, isError } = useDomains(teamId);
  const [addingDomain, setAddingDomain] = useState(false);

  // Add a new domain
  const handleAddDomain = async () => {
    if (!newDomain || !user) return;
    if (!/^([*.])?[a-zA-Z0-9][\w-]+(\.[\w-]+)+$/.test(newDomain)) {
      toast({
        variant: 'destructive',
        title: 'Invalid domain format',
        description: 'Please enter a valid domain like example.com or *.example.com',
      });
      return;
    }
    try {
      setAddingDomain(true);
      await addDomain.mutateAsync(newDomain);
      setNewDomain('');
      toast({ title: 'Domain added', description: 'Your domain has been added successfully.' });
    } catch (error) {
      console.error('Error adding domain:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add domain',
        description: 'Please try again later.',
      });
    } finally {
      setAddingDomain(false);
    }
  };

  // Delete a domain
  const handleDeleteDomain = async (id: string) => {
    try {
      await deleteDomain.mutateAsync(id);
      toast({ title: 'Domain deleted', description: 'Domain has been removed.' });
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete domain',
        description: 'Please try again later.',
      });
    }
  };

  if (isLoading) {
    return <DomainManagerSkeleton />;
  }
  if (isError) {
    return <div className="text-destructive">Failed to load domains</div>;
  }

  return (
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
          {!domains || domains.length === 0 ? (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDomain(domain.id)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DomainManagerSkeleton() {
  return (
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
            <div className="h-10 bg-muted rounded w-full animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Your Domains</h3>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <GlobeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DomainManager() {
  const { activeTeam } = useTeam();
  if (!activeTeam?.id) return <div className="text-muted-foreground">No team selected.</div>;
  return (
    <Suspense fallback={<DomainManagerSkeleton />}>
      <DomainManagerContent teamId={activeTeam.id} />
    </Suspense>
  );
} 