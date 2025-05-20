'use server'

import { createSupabaseSSRClient } from '@/lib/supabase/ssr'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Team } from '../models/team'
import { z } from 'zod'

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseSSRClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createSupabaseSSRClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string
  const full_name = email.split('@')[0]
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: full_name,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createSupabaseSSRClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * Initiates a Google OAuth sign-in flow using Supabase Auth.
 * @param redirectTo Optional URL to redirect to after authentication. Defaults to the home page.
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createSupabaseSSRClient();
  const baseUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://localhost:3000';
  const {data: oAuthResponse, error: oAuthError} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${baseUrl}/auth/callback`,
    },
  });

  if (oAuthError) {
    console.error(oAuthError);
    redirect('/error');
  }
  console.log(oAuthResponse.url);
  redirect(oAuthResponse.url);

} 
 
export async function getUserTeams(): Promise<Team[]> {
  // Create server-side Supabase client with cookie forwarding
  const supabase = await createSupabaseSSRClient();

  // Revalidate JWT and get the authenticated user
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    console.error('Auth error fetching user in getUserTeams:', authError);
    return [];
  }

  // Call the database function to get the teams for this user under RLS
  const { data: teamData, error: rpcError } = await supabase
    .rpc('get_user_teams') 
  if (rpcError || !teamData) {
    console.error('RPC error in getUserTeams:', rpcError);
    return [];
  }

  console.log('teamData', teamData)
  const teamArraySchema = z.array(Team);
  // Parse and return the team records
  try {
    return teamArraySchema.parse(teamData);
  } catch (e) {
    console.error('Team parsing error in getUserTeams:', e);
    return [];
  }
}