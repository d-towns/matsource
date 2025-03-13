import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { AgentEditForm } from './components/agent-edit-form';

export default async function AgentEditPage({ 
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {id} = await params;
  const {type} = await searchParams;
  const isNewAgent = id === 'new';
  const searchType = typeof type === 'string' ? type : 'voice';
  let agent = null;
  let error = null;

  try {
    // For existing agents, fetch data
    if (!isNewAgent) {
      const supabase = await createClient();
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        redirect('/login');
      }
      
      // Fetch agent data
      const { data, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No rows returned - agent not found
          notFound();
        } else {
          throw fetchError;
        }
      }
      
      agent = data;
    }
  } catch (err) {
    console.error('Error fetching agent:', err);
    error = err;
  }

  return (
    <div className="container py-10">
      {error ? (
        <div>
          <h1 className="text-2xl font-bold text-red-600">Error Loading Agent</h1>
          <p className="mt-2">There was a problem loading this agent. Please try again later.</p>
        </div>
      ) : (
        <AgentEditForm 
          initialAgent={agent} 
          isNewAgent={isNewAgent} 
          searchType={searchType}
        />
      )}
    </div>
  );
} 