import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmbedCodeGenerator } from './components/embed-code-generator';
import { DomainManager } from './components/domain-manager';
import { ExistingEmbedsDisplay } from './components/existing-embeds-display';


export default async function EmbedPage() {
  
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
          />
        </TabsContent>
        
        {/* Manage Domains Tab */}
        <TabsContent value="domains">
          <DomainManager />
        </TabsContent>
        
        {/* Existing Embeds Tab */}
        <TabsContent value="existing">
          <ExistingEmbedsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
} 