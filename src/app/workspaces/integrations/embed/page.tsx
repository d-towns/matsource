import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmbedCodeGenerator } from './components/embed-code-generator';
import { DomainManager } from './components/domain-manager';
import { ExistingEmbedsDisplay } from './components/existing-embeds-display';


export default async function EmbedPage() {
  const supabase = await createSupabaseSSRClient();
  
  // Fetch all necessary data in parallel
  const [domainResult, agentResult, apiKeyResult, formResult] = await Promise.all([
    supabase.from('domains').select('*'),
    supabase.from('agents').select('id, name, type'),
    supabase.from('api_keys').select('id, name'),
    supabase.from('forms').select('*')
  ]);
  
  // Handle any errors
  if (domainResult.error || agentResult.error || apiKeyResult.error || formResult.error) {
    console.error('Error fetching data:', {
      domainError: domainResult.error,
      agentError: agentResult.error,
      apiKeyError: apiKeyResult.error,
      formError: formResult.error
    });
    // Handle errors appropriately
  }
  
  const domains = domainResult.data || [];
  const agents = agentResult.data || [];
  const apiKeys = apiKeyResult.data || [];
  const formData = formResult.data || [];
  
  // Fetch form domains for each form
  const formsWithDomainsPromises = formData.map(async (form) => {
    const { data: domainData, error: domainError } = await supabase
      .from('form_domains')
      .select('domain')
      .eq('form_id', form.id);
    
    return {
      ...form,
      domains: domainError ? [] : domainData?.map(d => d.domain) || []
    };
  });
  
  const forms = await Promise.all(formsWithDomainsPromises);
  
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
          <EmbedCodeGenerator 
            domains={domains} 
            agents={agents} 
            apiKeys={apiKeys} 
          />
        </TabsContent>
        
        {/* Manage Domains Tab */}
        <TabsContent value="domains">
          <DomainManager initialDomains={domains} />
        </TabsContent>
        
        {/* Existing Embeds Tab */}
        <TabsContent value="existing">
          <ExistingEmbedsDisplay forms={forms} agents={agents} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 