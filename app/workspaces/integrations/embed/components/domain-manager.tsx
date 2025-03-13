'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlobeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/use-user';

interface Domain {
  id: string;
  domain: string;
}

interface DomainManagerProps {
  initialDomains: Domain[];
}

export function DomainManager({ initialDomains }: DomainManagerProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [newDomain, setNewDomain] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);
  const supabase = createClient();

  // Add a new domain
  const handleAddDomain = async () => {
    if (!newDomain || !user) return;
    
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
  );
} 