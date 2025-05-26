'use client';

import { useState } from "react";
import { Clipboard, Copy, Key, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTeam } from "@/context/team-context";

export interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

interface NewApiKey {
  id: string;
  name: string;
  key: string;
}

interface ApiKeyManagerProps {
  initialKeys: ApiKey[];
  userId: string;
}

export function ApiKeyManager({ initialKeys }: ApiKeyManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [newKeyLoading, setNewKeyLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys);
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [keyName, setKeyName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { activeTeam } = useTeam();
  // Create a new API key
  async function createApiKey() {
    if (!keyName.trim()) return;
    
    setNewKeyLoading(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: keyName, teamId: activeTeam?.id }),
      });
      
      if (!response.ok) throw new Error("Failed to create API key");
      
      const data = await response.json();
      setNewKey(data);
      setKeyName("");
      setDialogOpen(false);
      
      // Refresh data
      router.refresh();
      
      toast({
        title: "API key created",
        description: "Your new API key has been created successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating API key",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setNewKeyLoading(false);
    }
  }

  // Revoke an API key
  async function revokeApiKey(id: string) {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to revoke API key");
      
      // Update local state for immediate UI update
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      // Refresh data 
      router.refresh();
      
      toast({
        title: "API key revoked",
        description: "The API key has been revoked successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error revoking API key",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  // Copy API key to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied to clipboard",
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for authenticating widget requests.
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Enter a name for your API key to help you identify it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      placeholder="E.g., Widget Integration"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    disabled={!keyName.trim() || newKeyLoading} 
                    onClick={createApiKey}
                  >
                    {newKeyLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create API Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Key className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg">No API Keys</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                You haven&apos;t created any API keys yet. Create your first API key to authenticate requests to the widget service.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        {new Date(key.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {key.last_used_at 
                          ? new Date(key.last_used_at).toLocaleDateString() 
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => revokeApiKey(key.id)}
                          title="Revoke API Key"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show newly created API key */}
      {newKey && (
        <Card className="border-primary mt-6">
          <CardHeader>
            <CardTitle className="text-primary">New API Key Created</CardTitle>
            <CardDescription>
              This is your new API key. Make sure to copy it now as you won&apos;t be able to see it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Clipboard className="h-4 w-4" />
              <AlertTitle>Secret API Key</AlertTitle>
              <AlertDescription className="font-mono mt-2 break-all">
                {newKey.key}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setNewKey(null)}
            >
              Done
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(newKey.key)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
} 