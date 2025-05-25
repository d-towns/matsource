import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ApiKeyManager } from "./components/api-key-manager";
import { IntegrationGuide } from "./components/integration-guide";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";
import { ApiKey } from "./components/api-key-manager";
import { createSupabaseSSRClient } from "@/lib/supabase/ssr";

async function getApiKeys() {
  const supabase = await createSupabaseSSRClient();
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  // Fetch API keys
  const { data: apiKeys, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }
  
  return apiKeys as ApiKey[];
}

async function ApiKeysContent() {
  const apiKeys = await getApiKeys();
  
  // Get user info for the integration guide
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user.id || '';

  return (
    <div className="grid gap-6">
      <ApiKeyManager initialKeys={apiKeys} userId={userId} />
      <IntegrationGuide userId={userId} />
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage API keys for use with the BlueAgent Widget Service.
        </p>
      </div>
      
      <Separator />
      
      <Suspense fallback={<LoadingSpinner text="Loading API keys..." fullPage />}>
        <ApiKeysContent />
      </Suspense>
    </div>
  );
} 