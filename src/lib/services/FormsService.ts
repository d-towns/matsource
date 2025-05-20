import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { z } from 'zod';

// Zod schemas
export const FormSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  agent_id: z.string(),
  api_key_id: z.string(),
  name: z.string(),
  embed_code: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  expires_at: z.string().nullable(),
  is_active: z.boolean(),
  metadata: z.any().optional(),
  team_id: z.string().nullable(),
});

export const FormDomainSchema = z.object({
  id: z.string(),
  form_id: z.string(),
  domain: z.string(),
  created_at: z.string(),
});

export type Form = z.infer<typeof FormSchema>;
export type FormDomain = z.infer<typeof FormDomainSchema>;

export const FormsService = {
  /**
   * Fetch all forms for a given team.
   */
  async getFormsByTeam(teamId: string): Promise<Form[]> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return z.array(FormSchema).parse(data);
  },

  /**
   * Fetch all domains for a given form.
   */
  async getDomainsForForm(formId: string): Promise<FormDomain[]> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('form_domains')
      .select('*')
      .eq('form_id', formId);
    if (error) throw error;
    return z.array(FormDomainSchema).parse(data);
  },

  /**
   * Fetch all forms for a team, including their domains.
   */
  async getFormsWithDomainsByTeam(teamId: string): Promise<(Form & { domains: string[] })[]> {
    const forms = await this.getFormsByTeam(teamId);
    const supabase = await createSupabaseSSRClient();
    // Fetch all form_domains for these forms in one query
    const formIds = forms.map(f => f.id);
    const { data: domainsData, error } = await supabase
      .from('form_domains')
      .select('form_id, domain')
      .in('form_id', formIds);
    if (error) throw error;
    // Group domains by form_id
    const domainsByForm: Record<string, string[]> = {};
    (domainsData || []).forEach((fd: { form_id: string; domain: string }) => {
      if (!domainsByForm[fd.form_id]) domainsByForm[fd.form_id] = [];
      domainsByForm[fd.form_id].push(fd.domain);
    });
    return forms.map(form => ({
      ...form,
      domains: domainsByForm[form.id] || [],
    }));
  },

  /**
   * Create a new form for a team and user.
   */
  async createForm(form: Partial<Form>): Promise<Form> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('forms')
      .insert(form)
      .select()
      .single();
    if (error) throw error;
    return FormSchema.parse(data);
  },

  /**
   * Delete a form by id and team.
   */
  async deleteForm(formId: string, teamId: string): Promise<void> {
    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId)
      .eq('team_id', teamId);
    if (error) throw error;
  },
}; 