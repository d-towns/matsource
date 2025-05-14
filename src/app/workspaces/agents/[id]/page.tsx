import { AgentEditForm } from './components/agent-edit-form';
import { cookies } from 'next/headers';
import { getAgentById } from '@/lib/services/AgentService';

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
      try{
          const cookieStore = await cookies()
          const teamId = cookieStore.get('activeTeam')?.value
          if (!teamId) {
            throw new Error('No active team found');
          }
          agent = await getAgentById(id, teamId);
      } catch (err) {
        console.error('Error fetching agent:', err);
        error = err;
      }
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