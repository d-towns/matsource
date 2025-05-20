import { Form } from '@/lib/services/FormsService';

export async function fetchForms(teamId: string): Promise<Form[]> {
  const res = await fetch(`/api/forms?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error('Failed to fetch forms');
  const { forms } = await res.json();
  return forms;
}

export async function addForm(input: Partial<Form>, teamId: string): Promise<Form> {
  const res = await fetch('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return await res.json();
}

export async function deleteForm(id: string, teamId: string): Promise<void> {
  const res = await fetch('/api/forms', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, teamId }),
  });
  if (!res.ok) throw new Error('Failed to delete form');
} 