import { AgentEditForm } from './components/agent-edit-form';
import { cookies } from 'next/headers';
import { AgentService } from '@/lib/services/AgentService';
import { CreateAgentCard } from '../components/create-agent-card';

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
          agent = await AgentService.getAgentById(id, teamId);
      } catch (err) {
        console.error('Error fetching agent:', err);
        error = err;
      }
    }
  } catch (err) {
    console.error('Error fetching agent:', err);
    error = err;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-red-600">Error Loading Agent</h1>
        <p className="mt-2">There was a problem loading this agent. Please try again later.</p>
      </div>
    )
  }

  if (isNewAgent && !type) {
    return (
      <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Agent</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateAgentCard type="inbound_voice" />
        <CreateAgentCard type="outbound_voice" />
        <CreateAgentCard type="browser" />
      </div>
    </div>
    )
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